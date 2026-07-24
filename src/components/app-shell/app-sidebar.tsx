"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { MODULES, MODULE_GROUPS } from "@/lib/modules";
import { useOrg } from "@/lib/org-context";
import { hasPlanAccess, PLAN_LABEL } from "@/lib/plan";

export function AppSidebar() {
  const pathname = usePathname() ?? "";
  const org = useOrg();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/dashboard" className="px-2 py-1.5">
          <Logo size="sm" hideWordmarkOnCollapse />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {MODULE_GROUPS.map((group) => (
          <SidebarGroup key={group}>
            <SidebarGroupLabel>{group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {MODULES.filter((m) => m.group === group).map((mod) => {
                  const unlocked = hasPlanAccess(org.plan, mod.minPlan);
                  return (
                    <SidebarMenuItem key={mod.slug}>
                      <SidebarMenuButton
                        asChild
                        isActive={unlocked && pathname.startsWith(mod.href)}
                        tooltip={unlocked ? mod.name : `${mod.name} — requires ${PLAN_LABEL[mod.minPlan]}`}
                      >
                        <Link href={unlocked ? mod.href : `/pricing?upgrade=${mod.slug}`}>
                          <mod.icon />
                          <span>{mod.shortName}</span>
                          {!unlocked && <Lock className="ml-auto h-3 w-3 shrink-0 text-muted-foreground" />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="group-data-[collapsible=icon]:hidden rounded-lg border border-border/60 bg-card/50 px-3 py-2 text-xs">
          <p className="font-medium">{PLAN_LABEL[org.plan]} plan</p>
          {org.plan !== "enterprise" && (
            <Link href="/pricing" className="text-primary hover:underline">
              Upgrade
            </Link>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
