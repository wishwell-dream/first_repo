import { createClient } from "@supabase/supabase-js";
const allowedModes=new Set(["text","voice","both"]);
export default async function handler(req,res){
 if(req.method==="GET"){
  try{const sb=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);const {data,error}=await sb.from("wishes").select("id,text,name,hearts,audio_url,created_at").order("created_at",{ascending:false}).limit(30);if(error)throw error;return res.status(200).json({wishes:data})}catch(e){return res.status(500).json({error:"Could not load wishes"})}
 }
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
 try{
  const {text="",name="Anonymous",mode,paymentCaptureId,audioData,audioType}=req.body||{};
  if(!allowedModes.has(mode)||!paymentCaptureId)return res.status(400).json({error:"Invalid wish or missing payment"});
  const cleanText=String(text).trim(),cleanName=String(name).trim().slice(0,24)||"Anonymous";
  if(mode!=="voice"&&(!cleanText||cleanText.length>240))return res.status(400).json({error:"Wish text is required (max 240 characters)"});
  if(mode!=="text"&&!audioData)return res.status(400).json({error:"Voice recording is required"});
  if(audioData&&audioData.length>5_000_000)return res.status(413).json({error:"Audio file is too large"});
  const sb=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
  const {data:payment,error:paymentError}=await sb.from("payments").select("capture_id,used,status,amount,currency").eq("capture_id",paymentCaptureId).maybeSingle();
  if(paymentError)throw paymentError;
  if(!payment||payment.status!=="completed"||payment.used||payment.amount!=="0.99"||payment.currency!=="USD")return res.status(402).json({error:"Payment is invalid or has already been used"});
  let audioUrl=null;
  if(audioData){
   const mime=String(audioType||"audio/webm").split(";")[0];
   if(!["audio/webm","audio/ogg","audio/mp4","audio/mpeg"].includes(mime))return res.status(400).json({error:"Unsupported audio format"});
   const ext=({"audio/webm":"webm","audio/ogg":"ogg","audio/mp4":"m4a","audio/mpeg":"mp3"})[mime];
   const bytes=Buffer.from(audioData,"base64"),path=`${crypto.randomUUID()}.${ext}`;
   const {error:uploadError}=await sb.storage.from("wish-audio").upload(path,bytes,{contentType:mime,upsert:false});
   if(uploadError)throw uploadError;
   const {data:urlData}=sb.storage.from("wish-audio").getPublicUrl(path);audioUrl=urlData.publicUrl;
  }
  // Atomic SQL function consumes the payment once and inserts the wish.
  const {data:created,error:createError}=await sb.rpc("submit_paid_wish",{p_capture_id:paymentCaptureId,p_text:mode==="voice"?"":cleanText,p_name:cleanName,p_audio_url:audioUrl});
  if(createError)throw createError;
  return res.status(201).json({wish:created});
 }catch(e){return res.status(500).json({error:e.message||"Could not save wish"})}
}
