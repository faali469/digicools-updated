import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
        <p>© {new Date().getFullYear()} DigiCools. The AI Construction Operating System.</p>
        <div className="flex gap-6">
          <Link href="/pricing" className="transition-colors hover:text-foreground">
            Pricing
          </Link>
          <span>Planning</span>
          <span>Project Controls</span>
          <span>Procurement</span>
          <span>Site Execution</span>
        </div>
      </div>
    </footer>
  );
}
