import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, LogOut, FlaskConical, Package, Settings, Save } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase, type Product, type SiteSettings } from '@/lib/supabaseClient';
import { invalidateSiteSettingsCache } from '@/hooks/useSiteSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type EditForm = {
  name: string;
  slug: string;
  description: string;
  price: string;
  quantity: string;
  in_stock: boolean;
  image_url: string;
  category: string;
};

const emptyForm: EditForm = {
  name: '',
  slug: '',
  description: '',
  price: '',
  quantity: '0',
  in_stock: true,
  image_url: '',
  category: '',
};

type SettingsForm = {
  site_name: string;
  hero_image_url: string;
  hero_headline: string;
  hero_subheadline: string;
  bio: string;
  email: string;
  address: string;
};

const emptySettingsForm: SettingsForm = {
  site_name: '',
  hero_image_url: '',
  hero_headline: '',
  hero_subheadline: '',
  bio: '',
  email: '',
  address: '',
};

type Tab = 'products' | 'settings';

export function AdminDashboard() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [settingsForm, setSettingsForm] = useState<SettingsForm>(emptySettingsForm);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    const { data, error: fetchError } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!fetchError && data) setProducts(data);
    setLoading(false);
  }, []);

  const fetchSettings = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    if (!fetchError && data) {
      const s = data as SiteSettings;
      setSettingsForm({
        site_name: s.site_name ?? '',
        hero_image_url: s.hero_image_url ?? '',
        hero_headline: s.hero_headline ?? '',
        hero_subheadline: s.hero_subheadline ?? '',
        bio: s.bio ?? '',
        email: s.email ?? '',
        address: s.address ?? '',
      });
    }
    setSettingsLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, [fetchProducts, fetchSettings]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const openAdd = () => {
    setEditingId(null);
    setEditForm(emptyForm);
    setError(null);
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      slug: product.slug,
      description: product.description ?? '',
      price: String(product.price),
      quantity: String(product.quantity),
      in_stock: product.in_stock,
      image_url: product.image_url ?? '',
      category: product.category ?? '',
    });
    setError(null);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editForm.name.trim()) {
      setError('Name is required');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      name: editForm.name,
      slug: editForm.slug || editForm.name.toLowerCase().replace(/\s+/g, '-'),
      description: editForm.description || null,
      price: parseFloat(editForm.price) || 0,
      quantity: parseInt(editForm.quantity) || 0,
      in_stock: editForm.in_stock,
      image_url: editForm.image_url || null,
      category: editForm.category || null,
    };

    if (editingId) {
      const { error: updateError } = await supabase.from('products').update(payload).eq('id', editingId);
      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
      toast.success('Product updated successfully');
    } else {
      const { error: insertError } = await supabase.from('products').insert(payload);
      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
      toast.success('Product added successfully');
    }

    setDialogOpen(false);
    setSaving(false);
    await fetchProducts();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error: deleteError } = await supabase.from('products').delete().eq('id', deleteTarget.id);
    if (deleteError) {
      toast.error('Failed to delete product');
    } else {
      toast.success('Product deleted');
      setDeleteTarget(null);
      await fetchProducts();
    }
  };

  const toggleStock = async (product: Product) => {
    const newValue = !product.in_stock;
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, in_stock: newValue } : p))
    );
    const { error: toggleError } = await supabase.from('products').update({ in_stock: newValue }).eq('id', product.id);
    if (toggleError) {
      toast.error('Failed to update stock status');
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, in_stock: !newValue } : p))
      );
    } else {
      toast.success(newValue ? 'Marked as in stock' : 'Marked as out of stock');
    }
  };

  const inlineEditPrice = async (product: Product, value: string) => {
    const newPrice = parseFloat(value);
    if (isNaN(newPrice)) return;
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, price: newPrice } : p)));
    const { error: priceError } = await supabase.from('products').update({ price: newPrice }).eq('id', product.id);
    if (priceError) toast.error('Failed to update price');
  };

  const inlineEditQuantity = async (product: Product, value: string) => {
    const newQty = parseInt(value);
    if (isNaN(newQty)) return;
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, quantity: newQty } : p)));
    const { error: qtyError } = await supabase.from('products').update({ quantity: newQty }).eq('id', product.id);
    if (qtyError) toast.error('Failed to update quantity');
  };

  const handleSettingsSave = async () => {
    setSettingsSaving(true);
    setSettingsError(null);

    const payload = {
      site_name: settingsForm.site_name || null,
      hero_image_url: settingsForm.hero_image_url || null,
      hero_headline: settingsForm.hero_headline || null,
      hero_subheadline: settingsForm.hero_subheadline || null,
      bio: settingsForm.bio || null,
      email: settingsForm.email || null,
      address: settingsForm.address || null,
    };

    const { error: updateError } = await supabase.from('site_settings').update(payload).eq('id', 1);
    if (updateError) {
      setSettingsError(updateError.message);
      setSettingsSaving(false);
      return;
    }

    invalidateSiteSettingsCache();
    toast.success('Site settings saved successfully');
    setSettingsSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#1F1F2E] bg-[#12121A] flex flex-col fixed h-full z-30">
        <div className="p-6 border-b border-[#1F1F2E]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-lg chrome-text">THE NU365</span>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'products'
                ? 'text-foreground bg-secondary/50'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
            }`}
          >
            <Package className="w-4 h-4" /> Products
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'settings'
                ? 'text-foreground bg-secondary/50'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
            }`}
          >
            <Settings className="w-4 h-4" /> Site Settings
          </button>
        </div>

        <div className="p-4 border-t border-[#1F1F2E]">
          <div className="px-3 pb-3 text-xs text-muted-foreground truncate">{user?.email}</div>
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64">
        <div className="max-w-6xl mx-auto px-8 py-10">
          {activeTab === 'products' && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-between mb-8"
              >
                <div>
                  <h1 className="text-2xl font-heading font-bold tracking-tight">Product Management</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {products.length} products in catalog
                  </p>
                </div>
                <Button onClick={openAdd} className="gradient-bg text-white border-transparent h-10">
                  <Plus className="w-4 h-4 mr-2" /> Add Product
                </Button>
              </motion.div>

              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-14 bg-secondary/20 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="glass-card rounded-2xl overflow-hidden"
                >
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#1F1F2E] hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Name</TableHead>
                        <TableHead className="text-muted-foreground">Category</TableHead>
                        <TableHead className="text-muted-foreground">Price</TableHead>
                        <TableHead className="text-muted-foreground">Qty</TableHead>
                        <TableHead className="text-muted-foreground">Stock</TableHead>
                        <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id} className="border-[#1F1F2E]">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              {product.image_url && (
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              )}
                              {product.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{product.category ?? '—'}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              defaultValue={product.price}
                              onBlur={(e) => inlineEditPrice(product, e.target.value)}
                              className="w-24 h-8 bg-secondary/20 border-[#1F1F2E]"
                              step="0.01"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              defaultValue={product.quantity}
                              onBlur={(e) => inlineEditQuantity(product, e.target.value)}
                              className="w-20 h-8 bg-secondary/20 border-[#1F1F2E]"
                            />
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={product.in_stock}
                              onCheckedChange={() => toggleStock(product)}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEdit(product)}
                                className="h-8 w-8"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteTarget(product)}
                                className="h-8 w-8 text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </motion.div>
              )}
            </>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-8">
                <h1 className="text-2xl font-heading font-bold tracking-tight">Site Settings</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage global content shown across your site
                </p>
              </div>

              {settingsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-12 bg-secondary/20 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-6 space-y-6 max-w-2xl">
                  <div className="space-y-2">
                    <Label htmlFor="site_name">Site Name</Label>
                    <Input
                      id="site_name"
                      value={settingsForm.site_name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, site_name: e.target.value })}
                      placeholder="THE NU365"
                      className="bg-secondary/20 border-[#1F1F2E]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hero_image_url">Hero Image URL</Label>
                    <Input
                      id="hero_image_url"
                      value={settingsForm.hero_image_url}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hero_image_url: e.target.value })}
                      placeholder="https://..."
                      className="bg-secondary/20 border-[#1F1F2E]"
                    />
                    {settingsForm.hero_image_url && (
                      <img
                        src={settingsForm.hero_image_url}
                        alt="Hero preview"
                        className="mt-2 w-full h-32 rounded-lg object-cover border border-[#1F1F2E]"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hero_headline">Hero Headline</Label>
                    <Textarea
                      id="hero_headline"
                      value={settingsForm.hero_headline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hero_headline: e.target.value })}
                      placeholder="Proof over promises."
                      className="bg-secondary/20 border-[#1F1F2E]"
                      rows={2}
                    />
                    <p className="text-xs text-muted-foreground">Use a line break to split the headline into two lines.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hero_subheadline">Hero Subheadline</Label>
                    <Textarea
                      id="hero_subheadline"
                      value={settingsForm.hero_subheadline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hero_subheadline: e.target.value })}
                      placeholder="Premium-grade research compounds..."
                      className="bg-secondary/20 border-[#1F1F2E]"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={settingsForm.bio}
                      onChange={(e) => setSettingsForm({ ...settingsForm, bio: e.target.value })}
                      placeholder="Company bio shown in the footer..."
                      className="bg-secondary/20 border-[#1F1F2E]"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      placeholder="hnayel@yahoo.com"
                      className="bg-secondary/20 border-[#1F1F2E]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      placeholder="Cambridge, MA"
                      className="bg-secondary/20 border-[#1F1F2E]"
                    />
                  </div>

                  {settingsError && (
                    <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                      {settingsError}
                    </div>
                  )}

                  <div className="pt-2">
                    <Button
                      onClick={handleSettingsSave}
                      disabled={settingsSaving}
                      className="gradient-bg text-white border-transparent h-10"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {settingsSaving ? 'Saving...' : 'Save Settings'}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass border-[#1F1F2E] bg-[#12121A] max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription>
              {editingId ? 'Update product information below.' : 'Fill in the details for the new product.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="bg-secondary/20 border-[#1F1F2E]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={editForm.slug}
                onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                placeholder="auto-generated from name if empty"
                className="bg-secondary/20 border-[#1F1F2E]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="bg-secondary/20 border-[#1F1F2E]"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  className="bg-secondary/20 border-[#1F1F2E]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={editForm.quantity}
                  onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                  className="bg-secondary/20 border-[#1F1F2E]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="bg-secondary/20 border-[#1F1F2E]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={editForm.image_url}
                onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                placeholder="https://..."
                className="bg-secondary/20 border-[#1F1F2E]"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Switch
                id="in_stock"
                checked={editForm.in_stock}
                onCheckedChange={(checked) => setEditForm({ ...editForm, in_stock: checked })}
              />
              <Label htmlFor="in_stock">In Stock</Label>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-[#1F1F2E]">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gradient-bg text-white border-transparent">
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="glass border-[#1F1F2E] bg-[#12121A]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#1F1F2E]">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 text-white hover:bg-red-600 border-transparent"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
