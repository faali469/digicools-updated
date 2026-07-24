import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

// Verifies Stripe's webhook signature manually (HMAC-SHA256 over
// "{timestamp}.{payload}", per https://stripe.com/docs/webhooks/signatures)
// rather than pulling in the full Stripe SDK, to stay consistent with the
// razorpay-webhook function's dependency-free style.

async function verifyStripeSignature(payload: string, header: string, secret: string): Promise<boolean> {
  const parts = Object.fromEntries(
    header.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key, value];
    })
  );
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signedPayload = `${timestamp}.${payload}`;
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
  const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return expectedSignature === signature;
}

Deno.serve(async (req) => {
  try {
    const body = await req.text();
    const signatureHeader = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!signatureHeader || !webhookSecret) {
      return new Response("Missing signature or secret", { status: 400 });
    }

    const isValid = await verifyStripeSignature(body, signatureHeader, webhookSecret);
    if (!isValid) {
      return new Response("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(body);
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const sessionId = session.id;

      const { data: order } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("provider_payment_id", sessionId)
        .maybeSingle();

      if (order) {
        await supabaseAdmin.from("orders").update({ status: "paid" }).eq("id", order.id);

        if (order.plan_id) {
          const billingCycle = session.metadata?.billing_cycle === "yearly" ? "yearly" : "monthly";
          const periodEnd = new Date();
          if (billingCycle === "yearly") periodEnd.setFullYear(periodEnd.getFullYear() + 1);
          else periodEnd.setMonth(periodEnd.getMonth() + 1);

          await supabaseAdmin.from("subscriptions").insert({
            user_id: order.user_id,
            plan_id: order.plan_id,
            status: "active",
            provider: "stripe",
            provider_subscription_id: session.subscription ?? sessionId,
            billing_cycle: billingCycle,
            current_period_end: periodEnd.toISOString(),
          });
        }
      }
    }

    // Keep subscriptions in sync on renewal/cancellation too.
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      await supabaseAdmin
        .from("subscriptions")
        .update({ status: "cancelled" })
        .eq("provider_subscription_id", subscription.id);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
