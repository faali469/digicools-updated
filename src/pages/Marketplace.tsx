import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCategories, useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/marketplace/ProductCard";

type SortKey = "newest" | "rating" | "downloads";

const Marketplace = () => {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [activeCategory, setActiveCategory] = useState(categorySlug ?? "all");
  const [sort, setSort] = useState<SortKey>("newest");

  const { data: categories } = useCategories();
  const { data: products, isLoading } = useProducts({
    categorySlug: activeCategory !== "all" ? activeCategory : undefined,
    search: search || undefined,
  });

  const sortedProducts = useMemo(() => {
    if (!products) return [];
    const copy = [...products];
    if (sort === "rating") copy.sort((a, b) => Number(b.rating) - Number(a.rating));
    if (sort === "downloads") copy.sort((a, b) => b.downloads_count - a.downloads_count);
    return copy;
  }, [products, sort]);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <p className="mt-1 text-muted-foreground">Browse thousands of premium digital products.</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="downloads">Most Downloaded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={activeCategory === "all" ? "default" : "outline"}
          className={cn("rounded-full", activeCategory === "all" && "bg-gradient-primary")}
          onClick={() => setActiveCategory("all")}
        >
          All
        </Button>
        {categories?.map((cat) => (
          <Button
            key={cat.id}
            size="sm"
            variant={activeCategory === cat.slug ? "default" : "outline"}
            className={cn("rounded-full", activeCategory === cat.slug && "bg-gradient-primary")}
            onClick={() => setActiveCategory(cat.slug)}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      <div className="mt-10">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border py-20 text-center text-muted-foreground">
            No products found. Try a different search or category.
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
