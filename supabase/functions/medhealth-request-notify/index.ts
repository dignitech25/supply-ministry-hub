import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const schema = z.object({
  reference: z.string().min(1).max(64),
  name: z.string().min(1).max(200),
  email: z.string().email().max(255),
  phone: z.string().max(50).optional().default(""),
  client_reference: z.string().max(200).optional().default(""),
  delivery_suburb: z.string().max(200).optional().default(""),
  total: z.number().nonnegative(),
  source_url: z.string().max(500).optional().default(""),
  lines: z
    .array(
      z.object({
        product_name: z.string().max(300),
        product_code: z.string().max(100),
        category: z.string().max(200).optional().default(""),
        qty: z.number().int().positive().max(999),
        price_rrp: z.number().nullable().optional(),
      }),
    )
    .min(1)
    .max(200),
});

const esc = (s: string | null | undefined) =>
  (s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m] || m));

const money = (n: number | null | undefined) =>
  typeof n === "number" ? "$" + Math.round(n).toLocaleString("en-AU") : "POA";

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    const d = parsed.data;

    const rows = d.lines
      .map(
        (l) => `<tr>
          <td style="padding:6px 10px;border-bottom:1px solid #eee">${esc(l.product_name)}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #eee">${esc(l.product_code)}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:center">${l.qty}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right">${money(l.price_rrp ?? null)}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right">${money((l.price_rrp ?? 0) * l.qty)}</td>
        </tr>`,
      )
      .join("");

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const result = await resend.emails.send({
      from: "Supply Ministry <no-reply@supplyministry.com.au>",
      to: ["david@supplyministry.com.au", "alex@supplyministry.com.au"],
      reply_to: d.email,
      subject: `MedHealth catalogue request ${d.reference} from ${d.name}`,
      html: `
        <h2 style="font-family:Arial,sans-serif">MedHealth catalogue request</h2>
        <p style="font-family:Arial,sans-serif"><strong>Reference:</strong> ${esc(d.reference)}</p>
        <p style="font-family:Arial,sans-serif">
          <strong>Name:</strong> ${esc(d.name)}<br>
          <strong>Email:</strong> ${esc(d.email)}<br>
          <strong>Phone:</strong> ${esc(d.phone)}<br>
          <strong>Client reference:</strong> ${esc(d.client_reference) || "Not provided"}<br>
          <strong>Delivery suburb:</strong> ${esc(d.delivery_suburb) || "Not provided"}
        </p>
        <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;width:100%">
          <thead>
            <tr style="background:#f4efe6">
              <th style="padding:6px 10px;text-align:left">Product</th>
              <th style="padding:6px 10px;text-align:left">Code</th>
              <th style="padding:6px 10px;text-align:center">Qty</th>
              <th style="padding:6px 10px;text-align:right">Price</th>
              <th style="padding:6px 10px;text-align:right">Line total</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="font-family:Arial,sans-serif"><strong>Product subtotal:</strong> ${money(d.total)}<br>
        Delivery quoted separately.</p>
        ${d.source_url ? `<p style="font-family:Arial,sans-serif;font-size:12px;color:#666">Source: ${esc(d.source_url)}</p>` : ""}
      `,
    });

    if ((result as any)?.error) {
      console.error("Resend error:", (result as any).error);
      return new Response(JSON.stringify({ error: (result as any).error }), {
        status: 502,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e) {
    console.error("medhealth-request-notify failed:", e);
    return new Response(JSON.stringify({ error: "Unable to send notification" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
