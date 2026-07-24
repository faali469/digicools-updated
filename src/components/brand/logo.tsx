import { LogoMark } from "./logo-mark";
import { cn } from "@/lib/utils";

export function Logo({
  size = "md",
  hideWordmarkOnCollapse = false,
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  hideWordmarkOnCollapse?: boolean;
  className?: string;
}) {
  const markSize = { sm: 28, md: 32, lg: 36 }[size];
  const textSize = { sm: "text-sm", md: "text-lg", lg: "text-xl" }[size];

  return (
    <span className={cn("flex items-center gap-2 font-display font-semibold", textSize, className)}>
      <LogoMark size={markSize} className="shrink-0" />
      <span className={hideWordmarkOnCollapse ? "group-data-[collapsible=icon]:hidden" : undefined}>
        Digi<span className="text-primary">Cools</span>
      </span>
    </span>
  );
}
