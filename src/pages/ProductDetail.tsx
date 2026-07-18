import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Star, Download, Heart, Loader2, ShieldCheck, ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useWishlist, useSubscription } from "@/hooks/useWishlist";
import { useAuth } from "@/contexts/AuthContext";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(slug);
  const { data: related } = useProducts({ categorySlug: product?.categories?.slug });
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { data: subscription } = useSubscription();
  const { user, session } = useAuth();
  const [downloading, setDownloading] = useState(false);

  const isSubscribed = !!subscription;
  const price = Number(product?.price ?? 0);
  const needsPurchase = price > 0 && !isSubscribed;

  const handleDownload = async () => {
    if (!user || !session) {
      toast.error("Please sign in to download");
      return;
    }
    setDownloading(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-download-url", {
        body: { productId: product!.id },
      });
      if (error || data?.error) {
        if (data?.needsPurchase) {
          toast.error(data.error);
          navigate(`/checkout?product=${product!.id}`);
          return;
        }
        toast.error(data?.error || "Download failed. Please try again.");
        return;
      }
      window.open(data.url, "_blank");
      toast.success("Download started!");
    } finally {
      setDownloading(false);
    }
  };

  const handleAction = () => {
    if (!user) {
      toast.error("Please sign in first");
      navigate("/login");
      return;
    }
    if (needsPurchase) {
      navigate(`/checkout?product=${product!.id}`);
      return;
    }
    handleDownload();
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Button className="mt-4" asChild>
          <Link to="/marketplace">Back to Marketplace</Link>
        </Button>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  return (
    <div className="container py-10">
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link to="/marketplace">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Marketplace
        </Link>
      </Button>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="aspect-video overflow-hidden rounded-2xl border border-border/60 bg-muted">
            {product.thumbnail_url ? (
              <img src={product.thumbnail_url} alt={product.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-6xl font-bold text-muted-foreground">
                {product.title.slice(0, 1)}
              </div>
            )}
          </div>

          {product.preview_images && product.preview_images.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.preview_images.map((img: string, i: number) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg border border-border/60">
                  <img src={img} alt={`${product.title} preview ${i + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="mt-3 whitespace-pre-wrap text-muted-foreground">{product.description}</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border border-border/60 bg-card p-6 shadow-elegant">
            {product.categories?.name && (
              <Badge variant="outline" className="mb-3">{product.categories.name}</Badge>
            )}
            <h1 className="text-2xl font-bold">{product.title}</h1>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-3xl font-extrabold text-gradient">
                {price > 0 ? `₹${price}` : "Free"}
              </span>
              {price > 0 && isSubscribed && (
                <Badge className="bg-success text-success-foreground">Included in your plan</Badge>
              )}
            </div>

            <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                {Number(product.rating).toFixed(1)} rating
              </span>
              <span className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                {product.downloads_count} downloads
              </span>
            </div>

            <div className="mt-6 flex gap-2">
              <Button
                className="flex-1 bg-gradient-primary shadow-glow hover:opacity-90"
                onClick={handleAction}
                disabled={downloading}
              >
                {downloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : needsPurchase ? (
                  <ShoppingCart className="mr-2 h-4 w-4" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                {needsPurchase ? `Buy for ₹${price}` : "Download"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleWishlist(product.id)}
                aria-label="Toggle wishlist"
              >
                <Heart className={cn("h-4 w-4", wishlisted ? "fill-destructive text-destructive" : "")} />
              </Button>
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-success" />
              {price > 0
                ? "Buy this product individually, or subscribe to a plan for unlimited access to every product."
                : "This product is free to download for all members."}
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {related && related.filter((p) => p.id !== product.id).length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related
              .filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
