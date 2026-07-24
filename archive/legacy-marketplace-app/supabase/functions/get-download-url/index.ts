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

    const { productId } = await req.json();
    if (!productId) throw new Error("productId is required");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("file_path, downloads_count, price")
      .eq("id", productId)
      .maybeSingle();
    if (productError || !product || !product.file_path) throw new Error("Product file not found");

    const price = Number(product.price ?? 0);

    if (price > 0) {
      // Paid product: require an active subscription OR a completed purchase of this exact product.
      const { data: activeSub } = await supabaseAdmin
        .from("subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .limit(1)
        .maybeSingle();

      if (!activeSub) {
        const { data: paidOrder } = await supabaseAdmin
          .from("orders")
          .select("id")
          .eq("user_id", user.id)
          .eq("product_id", productId)
          .eq("status", "paid")
          .limit(1)
          .maybeSingle();

        if (!paidOrder) {
          return new Response(
            JSON.stringify({
              error: `This is a premium product (₹${price}). Please purchase it or subscribe to a plan for unlimited downloads.`,
              needsPurchase: true,
              price,
            }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
      .from("product-files")
      .createSignedUrl(product.file_path, 60 * 5);
    if (signedUrlError || !signedUrlData) throw new Error("Failed to generate download link");

    await supabaseAdmin.from("downloads").insert({ user_id: user.id, product_id: productId });
    await supabaseAdmin
      .from("products")
      .update({ downloads_count: (product.downloads_count ?? 0) + 1 })
      .eq("id", productId);

    return new Response(JSON.stringify({ url: signedUrlData.signedUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
