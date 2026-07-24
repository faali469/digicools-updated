import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useWishlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: wishlist = [] } = useQuery({
    queryKey: ["wishlist", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wishlist")
        .select("*, products(*)")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data;
    },
  });

  const isWishlisted = useCallback(
    (productId: string) => wishlist.some((w) => w.product_id === productId),
    [wishlist]
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (!user) {
        toast.error("Please sign in to save products");
        return;
      }
      const existing = wishlist.find((w) => w.product_id === productId);
      if (existing) {
        await supabase.from("wishlist").delete().eq("id", existing.id);
        toast.success("Removed from wishlist");
      } else {
        await supabase.from("wishlist").insert({ user_id: user.id, product_id: productId });
        toast.success("Added to wishlist");
      }
      queryClient.invalidateQueries({ queryKey: ["wishlist", user.id] });
    },
    [user, wishlist, queryClient]
  );

  return { wishlist, isWishlisted, toggleWishlist };
}

export function useSubscription() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["subscription", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*, plans(*)")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}
