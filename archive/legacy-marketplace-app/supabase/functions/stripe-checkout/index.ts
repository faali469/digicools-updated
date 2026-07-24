import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

// Card checkout via Stripe, alongside the existing Razorpay flow (UPI/cards for
// India). Stripe handles international card payments in USD. Both providers
// write into the same `orders` / `subscriptions` tables via the `provider`
// column, so the rest of the app (Dashboard, AdminOrders, get-download-url)
// doesn't need to know which processor was used.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function toFormBody(params: Record<string, string>) {
  return Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error("Unauthorized");
    const user = userData.user;

    const { planId, billingCycle, productId } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) throw new Error("Stripe is not configured");

    const origin = req.headers.get("origin") ?? Deno.env.get("SITE_URL") ?? "http://localhost:5173";

    // NOTE: plan/product prices are stored in INR (see migrations). This demo
    // charges the same numeric amount in USD via Stripe for simplicity — in a
    // real deployment, store a separate USD price column (or convert via a
    // live FX rate) before charging international cards.
    const formParams: Record<string, string> = {
      mode: "",
      "payment_method_types[0]": "card",
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/checkout?checkout=cancelled`,
      "metadata[user_id]": user.id,
    };

    let insertPayload: Record<string, unknown>;
    let amount: number;

    if (productId) {
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("id, price, title")
        .eq("id", productId)
        .maybeSingle();
      if (productError || !product) throw new Error("Product not found");

      amount = Number(product.price);
      if (amount <= 0) throw new Error("This product is free and does not require checkout");

      formParams.mode = "payment";
      formParams["line_items[0][quantity]"] = "1";
      formParams["line_items[0][price_data][currency]"] = "usd";
      formParams["line_items[0][price_data][unit_amount]"] = String(Math.round(amount * 100));
      formParams["line_items[0][price_data][product_data][name]"] = product.title;
      formParams["metadata[product_id]"] = productId;

      insertPayload = { user_id: user.id, product_id: productId };
    } else if (planId) {
      if (!["monthly", "yearly"].includes(billingCycle)) {
        throw new Error("billingCycle is required for plan checkout");
      }

      const { data: plan, error: planError } = await supabase
        .from("plans")
        .select("*")
        .eq("id", planId)
        .maybeSingle();
      if (planError || !plan) throw new Error("Plan not found");

      amount = billingCycle === "monthly" ? plan.price_monthly : plan.price_yearly;

      formParams.mode = "subscription";
      formParams["line_items[0][quantity]"] = "1";
      formParams["line_items[0][price_data][currency]"] = "usd";
      formParams["line_items[0][price_data][unit_amount]"] = String(Math.round(Number(amount) * 100));
      formParams["line_items[0][price_data][product_data][name]"] = `${plan.name} Plan (${billingCycle})`;
      formParams["line_items[0][price_data][recurring][interval]"] = billingCycle === "monthly" ? "month" : "year";
      formParams["metadata[plan_id]"] = planId;
      formParams["metadata[billing_cycle]"] = billingCycle;

      insertPayload = { user_id: user.id, plan_id: planId };
    } else {
      throw new Error("Either planId or productId is required");
    }

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: toFormBody(formParams),
    });

    if (!stripeResponse.ok) {
      const errText = await stripeResponse.text();
      throw new Error(`Stripe session creation failed: ${errText}`);
    }

    const session = await stripeResponse.json();

    await supabaseAdmin.from("orders").insert({
      ...insertPayload,
      amount,
      currency: "USD",
      provider: "stripe",
      provider_payment_id: session.id,
      status: "pending",
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
