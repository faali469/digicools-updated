import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import { ProductCard } from "@/components/marketplace/ProductCard";

const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold">My Wishlist</h1>
      <p className="mt-1 text-muted-foreground">Products you've saved for later.</p>

      <div className="mt-10">
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {wishlist.map((item) => (
              <ProductCard key={item.id} product={item.products} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-border py-20 text-center">
            <Heart className="mb-4 h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">Your wishlist is empty.</p>
            <Button className="mt-4 bg-gradient-primary" asChild>
              <Link to="/marketplace">Browse Marketplace</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
