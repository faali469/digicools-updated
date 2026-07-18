import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2, ShieldCheck, CreditCard, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { usePlans, useProductById } from "@/hooks/useProducts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

type PaymentProvider = "razorpay" | "stripe";

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { data: plans } = usePlans();
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<PaymentProvider>("razorpay");

  const planId = searchParams.get("plan");
  const productId = searchParams.get("product");
  const cycle = (searchParams.get("cycle") as "monthly" | "yearly") ?? "monthly";

  const plan = plans?.find((p) => p.id === planId);
  const { data: productById } = useProductById(productId);

  const isProductCheckout = !!productId;
  const price = isProductCheckout
    ? Number(productById?.price ?? 0)
    : plan
    ? (cycle === "monthly" ? plan.price_monthly : plan.price_yearly)
    : 0;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleRazorpayPay = async () => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Failed to load payment gateway");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.functions.invoke("razorpay-checkout", {
      body: isProductCheckout ? { productId } : { planId: plan!.id, billingCycle: cycle },
    });

    setLoading(false);

    if (error || !data || data.error) {
      toast.error(data?.error || "Could not start checkout");
      return;
    }

    const razorpay = new window.Razorpay({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      order_id: data.orderId,
      name: "DigiCools",
      description: isProductCheckout ? productById?.title : `${plan!.name} — ${cycle} subscription`,
      prefill: { email: user?.email, name: profile?.full_name ?? "" },
      theme: { color: "#4F46E5" },
      handler: () => {
        toast.success(
          isProductCheckout
            ? "Purchase successful! You can download the product now."
            : "Payment successful! Your plan will activate shortly."
        );
        navigate(isProductCheckout ? `/product/${productById?.slug}` : "/dashboard");
      },
      modal: {
        ondismiss: () => toast("Payment cancelled"),
      },
    });
    razorpay.open();
  };

  const handleStripePay = async () => {
    const { data, error } = await supabase.functions.invoke("stripe-checkout", {
      body: isProductCheckout ? { productId } : { planId: plan!.id, billingCycle: cycle },
    });

    setLoading(false);

    if (error || !data || data.error) {
      toast.error(data?.error || "Could not start checkout");
      return;
    }

    // Stripe Checkout is a hosted, redirect-based flow — no client SDK needed.
    window.location.href = data.url;
  };

  const handlePay = async () => {
    if (!isProductCheckout && !plan) return;
    if (isProductCheckout && !productById) return;

    if (Number(price) === 0) {
      toast.success("You're on the Free plan already!");
      navigate("/dashboard");
      return;
    }

    setLoading(true);
    if (provider === "razorpay") {
      await handleRazorpayPay();
    } else {
      await handleStripePay();
    }
  };

  if ((!isProductCheckout && !plan) || (isProductCheckout && !productById)) {
    return (
      <div className="container flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const features = (plan?.features as string[]) ?? [];
  const isFree = Number(price) === 0;

  return (
    <div className="container flex justify-center py-16">
      <Card className="w-full max-w-md border-border/60 shadow-elegant">
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
            {isProductCheckout ? (
              <>
                <p className="font-semibold">{productById?.title}</p>
                <p className="text-sm text-muted-foreground">One-time purchase</p>
              </>
            ) : (
              <>
                <p className="font-semibold">{plan?.name} Plan</p>
                <p className="text-sm text-muted-foreground capitalize">{cycle} billing</p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span>₹{price}</span>
          </div>

          {!isFree && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-muted-foreground">Choose a payment method</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setProvider("razorpay")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-colors",
                    provider === "razorpay" ? "border-primary bg-primary/10 text-primary" : "border-border/60 text-muted-foreground hover:border-border"
                  )}
                >
                  <Landmark className="h-4 w-4" /> Razorpay (UPI/Cards)
                </button>
                <button
                  type="button"
                  onClick={() => setProvider("stripe")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-colors",
                    provider === "stripe" ? "border-primary bg-primary/10 text-primary" : "border-border/60 text-muted-foreground hover:border-border"
                  )}
                >
                  <CreditCard className="h-4 w-4" /> Card (Stripe)
                </button>
              </div>
              {provider === "stripe" && (
                <p className="mt-2 text-xs text-muted-foreground">
                  International cards are charged in USD via Stripe.
                </p>
              )}
            </div>
          )}

          <Button className="mt-6 w-full bg-gradient-primary shadow-glow hover:opacity-90" onClick={handlePay} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isFree ? "Continue with Free" : provider === "stripe" ? "Pay with Card" : "Pay with Razorpay"}
          </Button>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-success" />
            Secure payment powered by {provider === "stripe" ? "Stripe" : "Razorpay"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Checkout;
