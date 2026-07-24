"use client";

import { MessageSquare, AtSign, CheckCircle2, Bell } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { StatTile } from "@/components/app-shell/stat-tile";
import { notifications } from "@/lib/mock-data";

export default function CollaborationPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Collaboration" description="Comments, mentions, approvals and activity across your projects." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Open threads" value="5" icon={MessageSquare} />
        <StatTile label="Mentions (7d)" value="12" icon={AtSign} />
        <StatTile label="Pending approvals" value="3" icon={CheckCircle2} />
      </div>

      <div className="mt-4 glass-card rounded-2xl p-5">
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <h3 className="font-display text-sm font-semibold">Activity timeline</h3>
        </div>
        <div className="space-y-4">
          {notifications.map((n) => (
            <div key={n.id} className="flex items-start gap-3 text-sm">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <p>
                <span className="font-medium">{n.actor}</span> {n.action}
                <span className="ml-2 text-xs text-muted-foreground">{n.time}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
