import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, Upload, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCategories } from "@/hooks/useProducts";

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  thumbnail_url: string | null;
  file_path: string | null;
  is_featured: boolean;
  status: string;
  downloads_count: number;
  rating: number;
  price: number;
}

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  category_id: "",
  thumbnail_url: "",
  file_path: "",
  is_featured: false,
  status: "published",
  price: "",
};

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const { data: categories } = useCategories();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Product[];
    },
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      title: product.title,
      slug: product.slug,
      description: product.description ?? "",
      category_id: product.category_id ?? "",
      thumbnail_url: product.thumbnail_url ?? "",
      file_path: product.file_path ?? "",
      is_featured: product.is_featured,
      status: product.status,
      price: String(product.price ?? ""),
    });
    setOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: false });
    setUploadingImage(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setForm((f) => ({ ...f, thumbnail_url: data.publicUrl }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("product-files").upload(path, file, { upsert: false });
    setUploadingFile(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setForm((f) => ({ ...f, file_path: path }));
    toast.success("File uploaded");
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      title: form.title,
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-"),
      description: form.description || null,
      category_id: form.category_id || null,
      thumbnail_url: form.thumbnail_url || null,
      file_path: form.file_path || null,
      is_featured: form.is_featured,
      status: form.status,
      price: Number(form.price) || 0,
    };

    const { error } = editing
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);

    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editing ? "Product updated" : "Product created");
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Product deleted");
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" /> New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Product" : "New Product"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Slug (optional)</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated from title" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
              </div>
              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. 199 (0 = free product)"
                />
                <p className="text-xs text-muted-foreground">
                  Charged only to users without an active subscription. Subscribers always get unlimited downloads.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Thumbnail Image</Label>
                <div className="flex items-center gap-3">
                  {form.thumbnail_url && (
                    <img src={form.thumbnail_url} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  )}
                  <Button type="button" variant="outline" size="sm" className="relative" disabled={uploadingImage}>
                    {uploadingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    Upload Image
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 cursor-pointer opacity-0" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Downloadable File</Label>
                <div className="flex items-center gap-3">
                  {form.file_path && <span className="text-xs text-muted-foreground">Uploaded ✓</span>}
                  <Button type="button" variant="outline" size="sm" className="relative" disabled={uploadingFile}>
                    {uploadingFile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    Upload File
                    <input type="file" onChange={handleFileUpload} className="absolute inset-0 cursor-pointer opacity-0" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                <Label htmlFor="featured">Featured Product</Label>
                <Switch id="featured" checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave} disabled={saving || !form.title} className="bg-gradient-primary">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 rounded-xl border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">Loading...</TableCell>
              </TableRow>
            ) : (
              products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="flex items-center gap-3 font-medium">
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-muted">
                      {product.thumbnail_url && <img src={product.thumbnail_url} className="h-full w-full object-cover" alt="" />}
                    </div>
                    <span className="flex items-center gap-1">
                      {product.title}
                      {product.is_featured && <Star className="h-3.5 w-3.5 fill-accent text-accent" />}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {Number(product.price) > 0 ? `₹${product.price}` : "Free"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.status === "published" ? "default" : "outline"}>{product.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.downloads_count}</TableCell>
                  <TableCell className="text-muted-foreground">{Number(product.rating).toFixed(1)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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

export default AdminProducts;
