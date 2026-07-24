import Link from "next/link";
import { AuroraBackground } from "@/components/layout/AuroraBackground";
import { Logo } from "@/components/brand/logo";
import { LogoWatermark } from "@/components/brand/logo-watermark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <AuroraBackground />
      <LogoWatermark className="-bottom-32 -right-32 h-[480px] w-[480px] text-foreground" />
      <div className="relative w-full max-w-sm">
        <Link href="/" className="mb-8 flex justify-center">
          <Logo size="lg" />
        </Link>
        <div className="glass-card rounded-2xl p-8 shadow-elegant">{children}</div>
      </div>
    </div>
  );
}
