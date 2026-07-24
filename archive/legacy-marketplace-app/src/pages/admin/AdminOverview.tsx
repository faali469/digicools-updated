import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Package, Users, Receipt, TrendingUp } from "lucide-react";

function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [{ count: productsCount }, { count: usersCount }, { data: orders }] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("amount, status"),
      ]);

      const revenue = (orders ?? [])
        .filter((o) => o.status === "paid")
        .reduce((sum, o) => sum + Number(o.amount), 0);

      return {
        productsCount: productsCount ?? 0,
        usersCount: usersCount ?? 0,
        ordersCount: orders?.length ?? 0,
        revenue,
      };
    },
  });
}

const AdminOverview = () => {
  const { data: stats } = useAdminStats();

  const cards = [
    { label: "Total Products", value: stats?.productsCount ?? 0, icon: Package },
    { label: "Total Users", value: stats?.usersCount ?? 0, icon: Users },
    { label: "Total Orders", value: stats?.ordersCount ?? 0, icon: Receipt },
    { label: "Revenue", value: `₹${stats?.revenue ?? 0}`, icon: TrendingUp },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Overview</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
              <card.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
