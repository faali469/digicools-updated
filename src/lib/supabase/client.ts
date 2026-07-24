import { createBrowserClient } from "@supabase/ssr";

// Not generic over Database — see src/lib/supabase/types.ts for why (the
// hand-authored schema type doesn't satisfy postgrest-js 2.x's stricter
// GenericSchema inference). Cast query results at the call site until real
// `supabase gen types` output replaces the hand-authored types.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
