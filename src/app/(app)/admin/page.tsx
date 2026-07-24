import { createClient } from "@/lib/supabase/server";
import { getCurrentOrg } from "@/lib/supabase/get-current-org";
import { AdminDashboard, type TeamMember, type AuditEntry } from "@/components/app-shell/admin-dashboard";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const org = await getCurrentOrg(supabase, user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  let members: TeamMember[] = [];
  let auditLog: AuditEntry[] = [];

  if (org) {
    const { data: memberRows, error: membersError } = await supabase
      .from("organization_members")
      .select("user_id, role, profiles(full_name)")
      .eq("org_id", org.id);

    if (membersError) {
      console.error("Failed to load organization members:", membersError.message);
    }

    members = ((memberRows ?? []) as unknown as {
      user_id: string;
      role: string;
      profiles: { full_name: string | null } | null;
    }[]).map((m) => ({
      id: m.user_id,
      name: m.profiles?.full_name ?? null,
      role: m.role,
      isYou: m.user_id === user.id,
    }));

    const { data: auditRows, error: auditError } = await supabase
      .from("audit_log")
      .select("id, action, created_at, profiles(full_name)")
      .eq("org_id", org.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (auditError) {
      console.error("Failed to load audit log:", auditError.message);
    }

    auditLog = ((auditRows ?? []) as unknown as {
      id: string;
      action: string;
      created_at: string;
      profiles: { full_name: string | null } | null;
    }[]).map((a) => ({
      id: a.id,
      actor: a.profiles?.full_name ?? "Someone",
      action: a.action,
      time: new Date(a.created_at).toLocaleString(),
    }));
  }

  return (
    <AdminDashboard
      orgId={org?.id ?? ""}
      orgName={org?.name ?? "Your Organization"}
      orgPlan={org?.plan ?? "starter"}
      brandColor={org?.brandColor ?? "#5B5FEF"}
      canManageOrg={org?.role === "owner" || org?.role === "admin"}
      members={members}
      fullName={(profile as { full_name: string | null } | null)?.full_name ?? ""}
      auditLog={auditLog}
    />
  );
}
