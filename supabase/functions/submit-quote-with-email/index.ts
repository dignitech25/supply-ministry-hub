import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuotePayload {
  requester_type: string;
  requester_name: string;
  requester_organisation?: string;
  requester_email: string;
  requester_phone?: string;
  client_name: string;
  client_ndis_number?: string;
  funding_type: string;
  delivery_address: string;
  clinical_context?: string;
  urgency: string;
  items: Array<{
    sku: string;
    title: string;
    size?: string;
    colour?: string;
    quantity: number;
    unit_price?: string;
    price_source?: string;
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: QuotePayload = await req.json();
    console.log("Received quote payload:", payload);

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Call the RPC function to create quote with items
    const { data: rpcResult, error: rpcError } = await supabase
      .rpc('create_quote_with_items', { p_payload: payload });

    if (rpcError) {
      console.error("RPC Error:", rpcError);
      throw new Error(`Failed to create quote: ${rpcError.message}`);
    }

    console.log("Quote created:", rpcResult);

    const quoteNumber = rpcResult[0]?.ref_code;
    
    if (!quoteNumber) {
      throw new Error("No quote reference returned from RPC");
    }

    // Prepare email content
    const itemsList = payload.items.map(item => 
      `• ${item.title} [${item.sku}] ${item.size || ''} ${item.colour || ''} x${item.quantity} @ $${item.unit_price || 'TBC'}`
    ).join('<br/>');

    const emailHtml = `
      <p>Hi ${payload.requester_name},</p>
      
      <p>Thank you for your quote request. Your reference number is <strong>${quoteNumber}</strong>.</p>
      
      <p>Our team will review and confirm pricing shortly.</p>
      
      <p>
        <strong>Requester Type:</strong> ${payload.requester_type}<br/>
        ${payload.requester_organisation ? `<strong>Organisation:</strong> ${payload.requester_organisation}<br/>` : ''}
        <strong>Client:</strong> ${payload.client_name}<br/>
        ${payload.client_ndis_number ? `<strong>NDIS Number:</strong> ${payload.client_ndis_number}<br/>` : ''}
        <strong>Funding:</strong> ${payload.funding_type}<br/>
        <strong>Delivery Address:</strong> ${payload.delivery_address}<br/>
        <strong>Urgency:</strong> ${payload.urgency}<br/>
        ${payload.clinical_context ? `<strong>Clinical Context:</strong> ${payload.clinical_context}<br/>` : ''}
      </p>
      
      <p><strong>Items:</strong><br/>${itemsList}</p>
      
      <p><em>Prices are indicative only and subject to Supply Ministry review. Freight, installation, and site requirements may affect the final price.</em></p>
      
      <p>
        Kind regards,<br/>
        Supply Ministry Team<br/>
        <a href='https://supplyministry.com.au'>supplyministry.com.au</a>
      </p>
    `;

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "Supply Ministry <no-reply@supplyministry.com.au>",
      to: [
        payload.requester_email,
        "david@supplyministry.com.au",
        "alex@supplyministry.com.au"
      ],
      subject: `Quote request received – ${quoteNumber}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        quoteNumber,
        emailId: emailResponse.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in submit-quote-with-email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An error occurred" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
