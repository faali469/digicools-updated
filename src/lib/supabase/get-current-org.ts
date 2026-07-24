import type { SupabaseClient } from "@supabase/supabase-js";
import type { OrgInfo } from "@/lib/org-context";

// Hand-cast row shape — see src/lib/supabase/types.ts for why queries aren't
// generically typed against Database yet.
type MembershipRow = {
  role: string;
  organizations: {
    id: string;
    name: string;
    plan: OrgInfo["plan"];
    brand_color: string;
    logo_url: string | null;
  } | null;
};

export async function getCurrentOrg(supabase: SupabaseClient, userId: string): Promise<OrgInfo | null> {
  const { data } = await supabase
    .from("organization_members")
    .select("role, organizations(id, name, plan, brand_color, logo_url)")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  const row = data as MembershipRow | null;
  if (!row?.organizations) return null;

  return {
    id: row.organizations.id,
    name: row.organizations.name,
    plan: row.organizations.plan,
    brandColor: row.organizations.brand_color,
    logoUrl: row.organizations.logo_url,
    role: row.role,
  };
}
