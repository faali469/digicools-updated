import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  category: {
    slug: string;
    name: string;
    icon: string | null;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = (category.icon && (Icons as unknown as Record<string, LucideIcon>)[category.icon]) || Icons.Package;

  return (
    <Link
      to={`/marketplace/${category.slug}`}
      className="group flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-primary/10 text-primary transition-colors group-hover:bg-gradient-primary group-hover:text-primary-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <span className="text-sm font-medium">{category.name}</span>
    </Link>
  );
}
