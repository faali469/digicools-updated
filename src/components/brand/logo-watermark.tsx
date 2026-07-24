import { cn } from "@/lib/utils";

export function LogoWatermark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute opacity-[0.06] mix-blend-screen dark:opacity-[0.08]",
        className
      )}
    >
      <rect x="9" y="20" width="5" height="12" rx="1.5" fill="currentColor" fillOpacity="0.6" />
      <rect x="17" y="14" width="5" height="18" rx="1.5" fill="currentColor" fillOpacity="0.8" />
      <rect x="25" y="8" width="5" height="24" rx="1.5" fill="currentColor" />
      <path
        d="M24 3L24.8 5.2L27 6L24.8 6.8L24 9L23.2 6.8L21 6L23.2 5.2Z"
        fill="currentColor"
      />
    </svg>
  );
}
