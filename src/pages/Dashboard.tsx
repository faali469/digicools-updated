import { Link } from "react-router-dom";
import { Download, Heart, CreditCard, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription, useWishlist } from "@/hooks/useWishlist";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function useDownloadHistory() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["downloads", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("downloads")
        .select("*, products(title, slug, thumbnail_url)")
        .eq("user_id", user!.id)
        .order("downloaded_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

const Dashboard = () => {
  const { profile } = useAuth();
  const { data: subscription } = useSubscription();
  const { wishlist } = useWishlist();
  const { data: downloads } = useDownloadHistory();

  const isSubscribed = !!subscription;

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || "there"}</h1>
      <p className="mt-1 text-muted-foreground">Here's what's happening with your account.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Plan</CardTitle>
            <Sparkles className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{subscription?.plans?.name ?? "Free"}</p>
            {!isSubscribed && (
              <Button size="sm" variant="link" className="mt-1 h-auto p-0 text-primary" asChild>
                <Link to="/pricing">Upgrade plan</Link>
              </Button>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{downloads?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Wishlist</CardTitle>
            <Heart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{wishlist.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="downloads" className="mt-10">
        <TabsList>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="downloads" className="mt-6">
          {downloads && downloads.length > 0 ? (
            <div className="space-y-3">
              {downloads.map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-muted">
                      {d.products?.thumbnail_url && (
                        <img src={d.products.thumbnail_url} className="h-full w-full object-cover" alt="" />
                      )}
                    </div>
                    <div>
                      <Link to={`/product/${d.products?.slug}`} className="font-medium hover:text-primary">
                        {d.products?.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {new Date(d.downloaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-muted-foreground">No downloads yet.</p>
          )}
        </TabsContent>

        <TabsContent value="subscription" className="mt-6">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary/10 text-primary">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">{subscription?.plans?.name ?? "Free Plan"}</p>
                  <p className="text-sm text-muted-foreground">
                    {isSubscribed
                      ? `Renews on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                      : "Pay per product, or subscribe for unlimited access"}
                  </p>
                </div>
              </div>
              {isSubscribed ? (
                <Badge className="bg-success text-success-foreground">Active</Badge>
              ) : (
                <Button className="bg-gradient-primary" asChild>
                  <Link to="/pricing">Upgrade</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
