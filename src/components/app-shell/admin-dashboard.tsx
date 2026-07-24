"use client";

import { useActionState } from "react";
import { ShieldCheck, Users, ScrollText, Building2, Loader2 } from "lucide-react";
import { StatTile } from "@/components/app-shell/stat-tile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PLAN_LABEL, type SubscriptionPlan } from "@/lib/plan";
import { ROLE_LABEL, ROLE_GROUPS } from "@/lib/roles";
import { updateOrganization, updateProfile } from "@/app/(app)/admin/actions";

export type TeamMember = { id: string; name: string | null; role: string; isYou: boolean };
export type AuditEntry = { id: string; actor: string; action: string; time: string };

export function AdminDashboard({
  orgId,
  orgName,
  orgPlan,
  brandColor,
  canManageOrg,
  members,
  fullName,
  auditLog,
}: {
  orgId: string;
  orgName: string;
  orgPlan: SubscriptionPlan;
  brandColor: string;
  canManageOrg: boolean;
  members: TeamMember[];
  fullName: string;
  auditLog: AuditEntry[];
}) {
  const [orgState, orgAction, orgPending] = useActionState<{ error: string | null; success?: boolean }, FormData>(
    updateOrganization,
    { error: null }
  );
  const [profileState, profileAction, profilePending] = useActionState<
    { error: string | null; success?: boolean },
    FormData
  >(updateProfile, { error: null });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Admin & Security</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Organization branding, subscription plan, team roles and audit log.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatTile label="Organization" value={orgName} icon={Building2} />
        <StatTile label="Plan" value={PLAN_LABEL[orgPlan]} icon={ShieldCheck} />
        <StatTile label="Team members" value={members.length.toString()} icon={Users} />
        <StatTile label="Audit events" value={auditLog.length.toString()} icon={ScrollText} />
      </div>

      <Tabs defaultValue="organization" className="mt-6">
        <TabsList>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="audit">Audit log</TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="mt-4">
          <div className="glass-card max-w-xl rounded-2xl p-6">
            {canManageOrg ? (
              <form action={orgAction} className="space-y-5">
                <input type="hidden" name="orgId" value={orgId} />
                <div className="space-y-1.5">
                  <Label htmlFor="name">Organization name</Label>
                  <Input id="name" name="name" defaultValue={orgName} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="brandColor">Brand color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      id="brandColor"
                      name="brandColor"
                      type="color"
                      defaultValue={brandColor}
                      className="h-9 w-14 cursor-pointer rounded-md border border-input bg-transparent p-1"
                    />
                    <span className="text-xs text-muted-foreground">
                      Applied across buttons, links and the sidebar for your organization.
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="plan">Subscription plan</Label>
                  <select
                    id="plan"
                    name="plan"
                    defaultValue={orgPlan}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="starter">Starter</option>
                    <option value="professional">Professional</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Admin-editable for now — this build doesn&apos;t process real payments yet (see{" "}
                    <a href="/pricing" className="text-primary hover:underline">
                      Pricing
                    </a>
                    ).
                  </p>
                </div>
                {orgState.error && <p className="text-sm text-destructive">{orgState.error}</p>}
                {orgState.success && <p className="text-sm text-success">Saved.</p>}
                <Button type="submit" disabled={orgPending} className="bg-gradient-primary shadow-glow hover:opacity-90">
                  {orgPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save changes
                </Button>
              </form>
            ) : (
              <p className="text-sm text-muted-foreground">
                Only organization owners and admins can edit these settings.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="team" className="mt-4 space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <p className="font-medium">
                        {m.name ?? "Unnamed"} {m.isYou && <span className="text-xs text-muted-foreground">(you)</span>}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{ROLE_LABEL[m.role as keyof typeof ROLE_LABEL] ?? m.role}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <h3 className="mb-1 font-display text-sm font-semibold">Available roles</h3>
            <p className="mb-4 text-xs text-muted-foreground">
              The full enterprise role vocabulary — invite flow to assign these to new teammates is coming soon.
            </p>
            <div className="space-y-4">
              {ROLE_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">{group.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.roles.map((role) => (
                      <Badge key={role} variant="outline" className="font-normal">
                        {ROLE_LABEL[role]}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="mt-4">
          <div className="glass-card max-w-xl rounded-2xl p-6">
            <form action={profileAction} className="space-y-5">
              <input type="hidden" name="orgId" value={orgId} />
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" name="fullName" defaultValue={fullName} required />
              </div>
              {profileState.error && <p className="text-sm text-destructive">{profileState.error}</p>}
              {profileState.success && <p className="text-sm text-success">Saved.</p>}
              <Button
                type="submit"
                disabled={profilePending}
                className="bg-gradient-primary shadow-glow hover:opacity-90"
              >
                {profilePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <div className="glass-card rounded-2xl p-5">
            {auditLog.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {auditLog.map((a) => (
                  <div key={a.id} className="text-sm">
                    <p>
                      <span className="font-medium">{a.actor}</span> — {a.action}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">{a.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
