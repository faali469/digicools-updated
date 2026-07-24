// Hand-authored types matching supabase/migrations/20260723120000_core_schema.sql.
// Extend alongside new migrations rather than relying on `supabase gen types`
// until the schema stabilizes.
//
// NOT currently passed as the generic to createBrowserClient/createServerClient
// (see client.ts/server.ts) — the installed postgrest-js (2.103.x) infers
// table Row/Insert types through a stricter GenericSchema chain than this
// shape satisfies, which collapses `.from(table)` results to `never`. Use
// these types via explicit casts at query call sites for now; swap in real
// `supabase gen types typescript` output to get full inference back.

type Table<Row, Insert extends Partial<Row> = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Partial<Row>;
  Relationships: [];
};

import type { SubscriptionPlan } from "@/lib/plan";
import type { MemberRole } from "@/lib/roles";

export type { SubscriptionPlan, MemberRole };

export type Database = {
  public: {
    Tables: {
      organizations: Table<
        {
          id: string;
          name: string;
          plan: SubscriptionPlan;
          logo_url: string | null;
          brand_color: string;
          created_at: string;
        },
        { name: string; plan?: SubscriptionPlan; logo_url?: string | null; brand_color?: string }
      >;
      profiles: Table<
        { id: string; full_name: string | null; avatar_url: string | null; created_at: string },
        { id: string; full_name?: string | null; avatar_url?: string | null }
      >;
      organization_members: Table<
        { org_id: string; user_id: string; role: MemberRole; created_at: string },
        { org_id: string; user_id: string; role?: MemberRole }
      >;
      projects: Table<
        {
          id: string;
          org_id: string;
          name: string;
          status: string;
          parent_project_id: string | null;
          created_at: string;
        },
        { org_id: string; name: string; status?: string; parent_project_id?: string | null }
      >;
      project_members: Table<
        { project_id: string; user_id: string; role: MemberRole; created_at: string },
        { project_id: string; user_id: string; role?: MemberRole }
      >;
      import_jobs: Table<
        {
          id: string;
          project_id: string | null;
          uploaded_by: string | null;
          file_name: string;
          file_type: string;
          status: string;
          created_at: string;
        },
        {
          project_id?: string | null;
          uploaded_by?: string | null;
          file_name: string;
          file_type: string;
          status?: string;
        }
      >;
      dashboards: Table<
        {
          id: string;
          project_id: string | null;
          org_id: string;
          name: string;
          created_by: string | null;
          created_at: string;
        },
        { project_id?: string | null; org_id: string; name: string; created_by?: string | null }
      >;
      dashboard_widgets: Table<
        { id: string; dashboard_id: string; type: string; title: string; config: Record<string, unknown>; sort_order: number },
        { dashboard_id: string; type: string; title: string; config?: Record<string, unknown>; sort_order?: number }
      >;
      notifications: Table<
        { id: string; user_id: string; actor_name: string | null; action: string; read: boolean; created_at: string },
        { user_id: string; actor_name?: string | null; action: string; read?: boolean }
      >;
      ai_copilot_messages: Table<
        {
          id: string;
          user_id: string;
          project_id: string | null;
          module: string | null;
          role: string;
          content: string;
          created_at: string;
        },
        { user_id: string; project_id?: string | null; module?: string | null; role: string; content: string }
      >;
      audit_log: Table<
        { id: string; org_id: string; actor_id: string | null; action: string; created_at: string },
        { org_id: string; actor_id?: string | null; action: string }
      >;
      org_integrations: Table<
        {
          id: string;
          org_id: string;
          provider: string;
          status: "available" | "not_connected" | "coming_soon";
          connected_at: string | null;
          connected_by: string | null;
          config: Record<string, unknown>;
        },
        {
          org_id: string;
          provider: string;
          status?: "available" | "not_connected" | "coming_soon";
          connected_at?: string | null;
          connected_by?: string | null;
          config?: Record<string, unknown>;
        }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
