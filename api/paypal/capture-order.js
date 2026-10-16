import { createClient } from "@supabase/supabase-js";
const PRICE="0.99";
async function paypalToken(){
 const auth=Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
 const r=await fetch(`${process.env.PAYPAL_API_BASE||"https://api-m.paypal.com"}/v1/oauth2/token`,{method:"POST",headers:{Authorization:`Basic ${auth}`,"Content-Type":"application/x-www-form-urlencoded"},body:"grant_type=client_credentials"});
 if(!r.ok)throw new Error("PayPal authentication failed");return (await r.json()).access_token;
}
export default async function handler(req,res){
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
 try{
  const {orderID}=req.body||{};if(!orderID||typeof orderID!=="string")return res.status(400).json({error:"Missing order ID"});
  const sb=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
  const token=await paypalToken();
  const r=await fetch(`${process.env.PAYPAL_API_BASE||"https://api-m.paypal.com"}/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`,{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json","PayPal-Request-Id":`capture-${orderID}`},body:"{}"});
  const data=await r.json();if(!r.ok)return res.status(402).json({error:"PayPal could not capture this payment"});
  const unit=data.purchase_units?.[0],capture=unit?.payments?.captures?.[0];
  if(data.status!=="COMPLETED"||capture?.status!=="COMPLETED"||capture?.amount?.currency_code!=="USD"||capture?.amount?.value!==PRICE)return res.status(402).json({error:"Payment amount or status did not match"});
  const {error}=await sb.from("payments").upsert({capture_id:capture.id,order_id:data.id,amount:PRICE,currency:"USD",status:"completed",used:false},{onConflict:"capture_id",ignoreDuplicates:true});
  if(error)throw error;
  return res.status(200).json({captureId:capture.id});
 }catch(e){return res.status(500).json({error:e.message||"Payment verification failed"})}
}
