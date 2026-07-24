import { createClient } from "@/lib/supabase/server";
import { getCurrentOrg } from "@/lib/supabase/get-current-org";
import { AppShell } from "@/components/app-shell/app-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const org = user ? await getCurrentOrg(supabase, user.id) : null;

  return (
    <AppShell email={user?.email ?? null} org={org}>
      {children}
    </AppShell>
  );
}
