"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SubscriptionPlan } from "@/lib/plan";

export type OrgInfo = {
  id: string;
  name: string;
  plan: SubscriptionPlan;
  brandColor: string;
  logoUrl: string | null;
  role: string | null;
};

const OrgContext = createContext<OrgInfo | null>(null);

export function OrgProvider({ org, children }: { org: OrgInfo; children: ReactNode }) {
  return <OrgContext.Provider value={org}>{children}</OrgContext.Provider>;
}

export function useOrg(): OrgInfo {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error("useOrg must be used within OrgProvider");
  return ctx;
}
