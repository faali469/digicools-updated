import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-id",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const AI_API_TOKEN = Deno.env.get("AI_API_TOKEN_2ebef0472818");
    if (!AI_API_TOKEN) {
      throw new Error("AI_API_TOKEN is not configured");
    }

    const upstreamSessionID = req.headers.get("X-Session-ID")?.trim() || crypto.randomUUID();
    const { messages } = await req.json();
    const selectedModel = "google/gemini-3.5-flash";

    // Build product catalog context so the assistant can recommend real products.
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: products } = await supabaseAdmin
      .from("products")
      .select("title, slug, description, categories(name)")
      .eq("status", "published")
      .limit(60);

    const catalogText = (products || [])
      .map((p: { title: string; slug: string; categories: { name: string } | null }) =>
        `- "${p.title}" (category: ${p.categories?.name ?? "General"}, url: /product/${p.slug})`
      )
      .join("\n");

    const systemInstruction = `You are the DigiCools AI shopping assistant for a premium digital product marketplace (AI prompts, Canva/Notion/Excel templates, UI kits, resumes, and more).
Help users find the right product from the catalog below based on their needs. Always recommend specific products by name and mention their URL path when relevant. If nothing matches, suggest the closest category and invite them to browse the Marketplace page. Keep replies concise and friendly.

Catalog:
${catalogText || "(catalog is currently empty)"}`;

    const contents = messages.map((message: { role: string; content: string }) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

    const body: Record<string, unknown> = {
      contents,
      generationConfig: { temperature: 0.6 },
      systemInstruction: { parts: [{ text: systemInstruction }] },
    };

    const response = await fetch(
      `https://api.enter.pro/code/api/ai/v1beta/models/${selectedModel}:streamGenerateContent`,
      {
        method: "POST",
        headers: {
          "x-goog-api-key": AI_API_TOKEN,
          "Content-Type": "application/json",
          "X-Session-ID": upstreamSessionID,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      let errorMessage = "AI service error";
      let errorStatus = "api_error";

      const dataMatch = text.match(/data: (.+)/);
      if (dataMatch) {
        try {
          const errorData = JSON.parse(dataMatch[1]);
          errorMessage = errorData.error?.message || errorMessage;
          errorStatus = errorData.error?.status || errorStatus;
        } catch { /* use defaults */ }
      } else {
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error?.message || errorMessage;
          errorStatus = errorData.error?.status || errorStatus;
        } catch { /* use defaults */ }
      }

      const errorSSE = `data: ${JSON.stringify({
        error: { code: response.status, message: errorMessage, status: errorStatus },
      })}\n\n`;

      return new Response(errorSSE, {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    const errorSSE = `data: ${JSON.stringify({
      error: { code: 500, message: error.message, status: "INTERNAL" },
    })}\n\n`;

    return new Response(errorSSE, {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  }
});
