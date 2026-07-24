import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });
}

export function useProducts(options?: { categorySlug?: string; search?: string; featured?: boolean }) {
  return useQuery({
    queryKey: ["products", options],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (options?.featured) query = query.eq("is_featured", true);
      if (options?.search) query = query.ilike("title", `%${options.search}%`);

      if (options?.categorySlug) {
        const { data: category } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", options.categorySlug)
          .maybeSingle();
        if (category) query = query.eq("category_id", category.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ["product", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useProductById(id: string | null | undefined) {
  return useQuery({
    queryKey: ["product-by-id", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function usePlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const { data, error } = await supabase.from("plans").select("*").order("price_monthly");
      if (error) throw error;
      return data;
    },
  });
}
