import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <Compass className="h-10 w-10 text-primary" />
      <h1 className="font-display text-2xl font-semibold">Page not found</h1>
      <p className="text-sm text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Button asChild className="bg-gradient-primary shadow-glow hover:opacity-90">
        <Link href="/">Back home</Link>
      </Button>
    </div>
  );
}
