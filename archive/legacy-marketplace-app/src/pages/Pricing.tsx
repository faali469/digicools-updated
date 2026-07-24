import { PricingSection } from "@/components/pricing/PricingSection";
import { AuroraBackground } from "@/components/layout/AuroraBackground";

const Pricing = () => {
  return (
    <div className="relative">
      <div className="relative overflow-hidden">
        <AuroraBackground />
        <div className="container relative py-16 text-center">
          <h1 className="text-3xl font-extrabold md:text-5xl">Plans for every creator</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Whether you're just starting out or scaling a team, DigiCools has a plan that fits.
          </p>
        </div>
      </div>
      <PricingSection />
    </div>
  );
};

export default Pricing;
