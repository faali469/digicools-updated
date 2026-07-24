import { Link } from "react-router-dom";
import { Heart, Download, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/useWishlist";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    thumbnail_url: string | null;
    rating: number;
    downloads_count: number;
    is_featured?: boolean;
    price?: number;
    categories?: { name: string } | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {product.thumbnail_url ? (
            <img
              src={product.thumbnail_url}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-primary/10 text-4xl font-bold text-muted-foreground">
              {product.title.slice(0, 1)}
            </div>
          )}
          {product.is_featured && (
            <Badge className="absolute left-3 top-3 bg-gradient-primary border-0">Featured</Badge>
          )}
          <Badge
            variant="secondary"
            className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm"
          >
            {Number(product.price) > 0 ? `₹${product.price}` : "Free"}
          </Badge>
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product.id);
        }}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
        aria-label="Toggle wishlist"
      >
        <Heart className={cn("h-4 w-4", wishlisted ? "fill-destructive text-destructive" : "text-foreground")} />
      </button>

      <div className="p-4">
        {product.categories?.name && (
          <p className="text-xs font-medium text-primary">{product.categories.name}</p>
        )}
        <Link to={`/product/${product.slug}`}>
          <h3 className="mt-1 line-clamp-1 font-semibold hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            {Number(product.rating).toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5" />
            {product.downloads_count}
          </span>
        </div>
      </div>
    </div>
  );
}
