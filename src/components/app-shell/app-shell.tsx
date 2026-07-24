"use client";

import type { CSSProperties, ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-shell/app-sidebar";
import { AppTopbar } from "@/components/app-shell/app-topbar";
import { AICopilot } from "@/components/app-shell/ai-copilot";
import { PageTransition } from "@/components/app-shell/page-transition";
import { LogoWatermark } from "@/components/brand/logo-watermark";
import { OrgProvider, type OrgInfo } from "@/lib/org-context";
import { getBrandCssVars } from "@/lib/color";

const FALLBACK_ORG: OrgInfo = {
  id: "",
  name: "Your Organization",
  plan: "starter",
  brandColor: "#5B5FEF",
  logoUrl: null,
  role: null,
};

export function AppShell({
  email,
  org,
  children,
}: {
  email: string | null;
  org: OrgInfo | null;
  children: ReactNode;
}) {
  const resolvedOrg = org ?? FALLBACK_ORG;
  const brandVars = getBrandCssVars(resolvedOrg.brandColor) ?? {};

  return (
    <OrgProvider org={resolvedOrg}>
      <div style={brandVars as CSSProperties}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <LogoWatermark className="bottom-0 right-0 z-0 h-[420px] w-[420px] text-foreground" />
            <div className="relative z-10 flex min-h-full flex-col">
              <AppTopbar email={email} />
              <main className="flex-1 p-4 md:p-6">
                <PageTransition>{children}</PageTransition>
              </main>
            </div>
          </SidebarInset>
          <AICopilot />
        </SidebarProvider>
      </div>
    </OrgProvider>
  );
}
