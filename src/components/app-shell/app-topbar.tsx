"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, Settings, ShieldCheck, User as UserIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MODULES } from "@/lib/modules";
import { useOrg } from "@/lib/org-context";
import { signOut } from "@/app/(auth)/actions";

export function AppTopbar({ email }: { email: string | null }) {
  const pathname = usePathname() ?? "";
  const org = useOrg();
  const current = MODULES.find((m) => pathname.startsWith(m.href));

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />
      <div className="flex items-center gap-2 text-sm">
        <Button variant="outline" size="sm" className="h-8 gap-1.5 rounded-lg" asChild>
          <Link href="/admin">
            {org.name}
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </Link>
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium">{current?.name ?? "Overview"}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm" asChild className="h-8 gap-1.5 rounded-lg">
          <Link href="/admin">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </Button>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-muted">
              <UserIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm text-muted-foreground truncate">{email ?? "Signed in"}</div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin" className="flex items-center gap-2">
                <Settings className="h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <form action={signOut} className="w-full">
                <button type="submit" className="flex w-full items-center gap-2">
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
