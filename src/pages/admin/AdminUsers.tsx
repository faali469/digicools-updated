import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminUsers = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const [{ data: profiles, error }, { data: downloads }] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("downloads").select("user_id"),
      ]);
      if (error) throw error;

      const downloadCounts = new Map<string, number>();
      for (const d of downloads ?? []) {
        downloadCounts.set(d.user_id, (downloadCounts.get(d.user_id) ?? 0) + 1);
      }

      return (profiles ?? []).map((p) => ({ ...p, downloadCount: downloadCounts.get(p.id) ?? 0 }));
    },
  });

  const handleRoleChange = async (userId: string, role: "admin" | "user") => {
    const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Role updated");
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Users</h1>
      <div className="mt-6 rounded-xl border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">Loading...</TableCell>
              </TableRow>
            ) : (
              users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name ?? "Unnamed"}</TableCell>
                  <TableCell className="text-muted-foreground">{user.downloadCount}</TableCell>
                  <TableCell>
                    <Select value={user.role} onValueChange={(v) => handleRoleChange(user.id, v as "admin" | "user")}>
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsers;
