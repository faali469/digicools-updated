"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ActionState = { error: string | null; success?: boolean };

async function logAudit(
  supabase: Awaited<ReturnType<typeof createClient>>,
  orgId: string,
  actorId: string | null,
  action: string
) {
  await supabase.from("audit_log").insert({ org_id: orgId, actor_id: actorId, action });
}

export async function updateOrganization(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const orgId = String(formData.get("orgId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const brandColor = String(formData.get("brandColor") ?? "");
  const plan = String(formData.get("plan") ?? "");

  if (!orgId || !name) return { error: "Organization name is required." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("organizations")
    .update({ name, brand_color: brandColor, plan })
    .eq("id", orgId);

  if (error) return { error: error.message };

  await logAudit(supabase, orgId, user?.id ?? null, `Updated organization settings (name, brand color, plan → ${plan})`);

  revalidatePath("/", "layout");
  return { error: null, success: true };
}

export async function updateProfile(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const orgId = String(formData.get("orgId") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  if (!fullName) return { error: "Full name is required." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
  if (error) return { error: error.message };

  if (orgId) {
    await logAudit(supabase, orgId, user.id, `Updated their profile name to "${fullName}"`);
  }

  revalidatePath("/", "layout");
  return { error: null, success: true };
}
