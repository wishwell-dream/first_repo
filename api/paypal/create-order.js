import { createClient } from "@supabase/supabase-js";
const PRICE = "0.99";
async function paypalToken(){
 const auth=Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
 const r=await fetch(`${process.env.PAYPAL_API_BASE||"https://api-m.paypal.com"}/v1/oauth2/token`,{method:"POST",headers:{Authorization:`Basic ${auth}`,"Content-Type":"application/x-www-form-urlencoded"},body:"grant_type=client_credentials"});
 if(!r.ok)throw new Error("PayPal authentication failed");return (await r.json()).access_token;
}
export default async function handler(req,res){
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
 try{
  if(!process.env.PAYPAL_CLIENT_ID||!process.env.PAYPAL_CLIENT_SECRET)throw new Error("PayPal server environment is not configured");
  const token=await paypalToken();
  const r=await fetch(`${process.env.PAYPAL_API_BASE||"https://api-m.paypal.com"}/v2/checkout/orders`,{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json","PayPal-Request-Id":crypto.randomUUID()},body:JSON.stringify({intent:"CAPTURE",purchase_units:[{amount:{currency_code:"USD",value:PRICE},description:"Wishwell — one wish"}]})});
  const data=await r.json();if(!r.ok)return res.status(502).json({error:"PayPal order creation failed"});
  return res.status(200).json({id:data.id});
 }catch(e){return res.status(500).json({error:e.message||"Could not create order"})}
}
