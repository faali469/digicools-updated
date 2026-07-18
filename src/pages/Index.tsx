import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Search, ShieldCheck, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuroraBackground } from "@/components/layout/AuroraBackground";
import { useCategories, useProducts } from "@/hooks/useProducts";
import { CategoryCard } from "@/components/marketplace/CategoryCard";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { PricingSection } from "@/components/pricing/PricingSection";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Digital Products", value: "10,000+" },
  { label: "Happy Creators", value: "50,000+" },
  { label: "Categories", value: "25+" },
  { label: "Avg. Rating", value: "4.9/5" },
];

const Index = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const { data: featured } = useProducts({ featured: true });
  const { data: trending } = useProducts();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/marketplace${search ? `?q=${encodeURIComponent(search)}` : ""}`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <AuroraBackground />
        <div className="container relative py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              One Subscription. Unlimited Creativity.
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
              Premium digital products,
              <br />
              <span className="text-gradient">all in one place</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              AI prompts, Canva & Notion templates, UI kits, resumes and more — download unlimited premium assets with a single subscription.
            </p>

            <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full border border-border/60 bg-card/80 p-2 shadow-elegant backdrop-blur-xl">
              <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Try 'resume template' or 'AI prompts'..."
                className="border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              <Button type="submit" className="rounded-full bg-gradient-primary shadow-glow hover:opacity-90">
                Search
              </Button>
            </form>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" className="rounded-full bg-gradient-primary shadow-glow hover:opacity-90" asChild>
                <Link to="/marketplace">
                  Explore Marketplace <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full" asChild>
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </motion.div>

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-gradient md:text-3xl">{stat.value}</p>
                <p className="text-xs text-muted-foreground md:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold md:text-3xl">Browse Categories</h2>
          <Button variant="ghost" asChild>
            <Link to="/marketplace">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {categories?.slice(0, 10).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured products */}
      {featured && featured.length > 0 && (
        <section className="container py-16">
          <div className="mb-10 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold md:text-3xl">Featured Products</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Trending */}
      <section className="container py-16">
        <div className="mb-10 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold md:text-3xl">Trending Now</h2>
        </div>
        {trending && trending.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trending.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
            Products will appear here once added from the admin panel.
          </div>
        )}
      </section>

      {/* Trust badges */}
      <section className="border-y border-border/60 bg-card/40 py-14">
        <div className="container grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">Stripe & Razorpay protected checkout</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-primary/10 text-primary">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Instant Downloads</h3>
              <p className="text-sm text-muted-foreground">Get your files immediately after purchase</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">AI Assistant</h3>
              <p className="text-sm text-muted-foreground">Find the perfect product in seconds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <PricingSection compact />
    </div>
  );
};

export default Index;
