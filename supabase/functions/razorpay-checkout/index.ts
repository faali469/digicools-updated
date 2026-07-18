import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    let amount: number;
    let orderNotes: Record<string, string>;
    let insertPayload: Record<string, unknown>;

    if (productId) {
      // Single product purchase
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("id, price, title")
        .eq("id", productId)
        .maybeSingle();
      if (productError || !product) throw new Error("Product not found");

      amount = Number(product.price);
      if (amount <= 0) throw new Error("This product is free and does not require checkout");

      orderNotes = { user_id: user.id, product_id: productId };
      insertPayload = { user_id: user.id, product_id: productId };
    } else if (planId) {
      // Subscription plan purchase
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
      orderNotes = { user_id: user.id, plan_id: planId, billing_cycle: billingCycle };
      insertPayload = { user_id: user.id, plan_id: planId };
    } else {
      throw new Error("Either planId or productId is required");
    }

    const amountPaise = Math.round(Number(amount) * 100);

    const keyId = Deno.env.get("RAZORPAY_KEY_ID");
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!keyId || !keySecret) throw new Error("Razorpay keys are not configured");

    const auth = btoa(`${keyId}:${keySecret}`);

    const orderResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        notes: orderNotes,
      }),
    });

    if (!orderResponse.ok) {
      const errText = await orderResponse.text();
      throw new Error(`Razorpay order creation failed: ${errText}`);
    }

    const order = await orderResponse.json();

    await supabaseAdmin.from("orders").insert({
      ...insertPayload,
      amount,
      currency: "INR",
      provider: "razorpay",
      provider_payment_id: order.id,
      status: "pending",
    });

    return new Response(
      JSON.stringify({
        orderId: order.id,
        amount: amountPaise,
        currency: "INR",
        keyId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
