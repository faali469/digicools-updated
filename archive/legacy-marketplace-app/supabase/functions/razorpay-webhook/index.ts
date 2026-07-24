import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

Deno.serve(async (req) => {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");

    if (!signature || !webhookSecret) {
      return new Response("Missing signature or secret", { status: 400 });
    }

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(webhookSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (expectedSignature !== signature) {
      return new Response("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(body);
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;

      const { data: order } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("provider_payment_id", orderId)
        .maybeSingle();

      if (order) {
        await supabaseAdmin.from("orders").update({ status: "paid" }).eq("id", order.id);

        // Only plan purchases create a subscription. Single-product purchases
        // are gated in get-download-url by checking for a "paid" order with matching product_id.
        if (order.plan_id) {
          const periodEnd = new Date();
          periodEnd.setMonth(periodEnd.getMonth() + 1);

          await supabaseAdmin.from("subscriptions").insert({
            user_id: order.user_id,
            plan_id: order.plan_id,
            status: "active",
            provider: "razorpay",
            provider_subscription_id: orderId,
            billing_cycle: "monthly",
            current_period_end: periodEnd.toISOString(),
          });
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
