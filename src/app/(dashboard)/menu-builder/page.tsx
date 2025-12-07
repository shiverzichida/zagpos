'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Category, Product } from '@/types';
import { useToastStore } from '@/stores/toastStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/formatters';
import { ModifierManager } from '@/components/menu/ModifierManager';
import { ProductModifierSelector } from '@/components/menu/ProductModifierSelector';

export default function MenuBuilderPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToastStore();
  const { currency } = useSettingsStore();

  // Modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [categoryName, setCategoryName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategoryId, setProductCategoryId] = useState('');
  const [productModifierGroupIds, setProductModifierGroupIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('products').select('*').order('name'),
      ]);

      setCategories(categoriesRes.data || []);
      setProducts(productsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Category functions
  const openCategoryModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
      setCategoryIcon(category.icon || '');
    } else {
      setEditingCategory(null);
      setCategoryName('');
      setCategoryIcon('');
    }
    setIsCategoryModalOpen(true);
  };

  const saveCategory = async () => {
    if (!categoryName.trim()) return;

    setSaving(true);
    try {
      if (editingCategory) {
        await supabase
          .from('categories')
          .update({ name: categoryName, icon: categoryIcon || null })
          .eq('id', editingCategory.id);
        showToast('Kategori berhasil diperbarui', 'success');
      } else {
        await supabase
          .from('categories')
          .insert({ name: categoryName, icon: categoryIcon || null });
        showToast('Kategori berhasil dibuat', 'success');
      }
      await fetchData();
      setIsCategoryModalOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
      showToast('Gagal menyimpan kategori', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Hapus kategori ini? Produk dalam kategori ini akan menjadi tanpa kategori.')) return;

    try {
      await supabase.from('categories').delete().eq('id', id);
      await fetchData();
      showToast('Kategori berhasil dihapus', 'success');
    } catch (error) {
      console.error('Error deleting category:', error);
      showToast('Gagal menghapus kategori', 'error');
    }
  };

  // Product functions
  const openProductModal = async (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductName(product.name);
      setProductPrice(product.price.toString());
      setProductCategoryId(product.category_id);

      // Fetch assigned modifiers
      const { data } = await supabase
        .from('product_modifiers')
        .select('modifier_group_id')
        .eq('product_id', product.id);
      setProductModifierGroupIds(data?.map(pm => pm.modifier_group_id) || []);
    } else {
      setEditingProduct(null);
      setProductName('');
      setProductPrice('');
      setProductCategoryId(categories[0]?.id || '');
      setProductModifierGroupIds([]);
    }
    setIsProductModalOpen(true);
  };

  const saveProduct = async () => {
    if (!productName.trim() || !productPrice) return;

    setSaving(true);
    try {
      const productData = {
        name: productName,
        price: parseFloat(productPrice),
        category_id: productCategoryId || null,
      };

      let productId = editingProduct?.id;

      if (editingProduct) {
        await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        showToast('Produk berhasil diperbarui', 'success');
      } else {
        const { data } = await supabase.from('products').insert(productData).select().single();
        if (data) productId = data.id;
        showToast('Produk berhasil dibuat', 'success');
      }

      // Handle modifiers linking
      if (productId) {
        // Delete existing links
        await supabase.from('product_modifiers').delete().eq('product_id', productId);

        // Add new links
        if (productModifierGroupIds.length > 0) {
          const links = productModifierGroupIds.map(groupId => ({
            product_id: productId,
            modifier_group_id: groupId
          }));
          await supabase.from('product_modifiers').insert(links);
        }
      }

      await fetchData();
      setIsProductModalOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('Gagal menyimpan produk', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Hapus produk ini?')) return;

    try {
      await supabase.from('products').delete().eq('id', id);
      await fetchData();
      showToast('Produk berhasil dihapus', 'success');
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('Gagal menghapus produk', 'error');
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Kelola Menu</h1>
        <p className="text-[var(--text-secondary)]">Kelola kategori dan produk</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Kiri */}
        <div className="space-y-8">
          {/* Categories Panel */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Kategori</h2>
              <Button size="sm" onClick={() => openCategoryModal()}>
                + Tambah
              </Button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${selectedCategory === null
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                  }`}
              >
                Semua Produk ({products.length})
              </button>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`p-3 rounded-lg transition-colors ${selectedCategory === category.id
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      className="flex-1 text-left"
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.name} ({products.filter((p) => p.category_id === category.id).length})
                    </button>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openCategoryModal(category)}
                        className="p-1 hover:text-[var(--accent)]"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="p-1 hover:text-[var(--danger)]"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modifiers Panel (New) */}
          <div className="pt-6 border-t border-[var(--border)]">
            <ModifierManager />
          </div>
        </div>

        {/* Products Panel (Kanan) */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Produk</h2>
            <Button size="sm" onClick={() => openProductModal()}>
              + Tambah Produk
            </Button>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[var(--text-secondary)]">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-lg font-medium">Belum ada produk</p>
              <p className="text-sm">Tambahkan produk pertama Anda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-[var(--text-primary)]">{product.name}</h3>
                      <p className="text-[var(--accent)] font-semibold">{formatCurrency(product.price, currency)}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">
                        {categories.find((c) => c.id === product.category_id)?.name || 'Tanpa Kategori'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openProductModal(product)}
                        className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)]"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 text-[var(--text-secondary)] hover:text-[var(--danger)]"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
      >
        <div className="space-y-4">
          <Input
            label="Nama"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Contoh: Kopi"
          />
          <Input
            label="Ikon (emoji)"
            value={categoryIcon}
            onChange={(e) => setCategoryIcon(e.target.value)}
            placeholder="Contoh: ☕"
          />
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setIsCategoryModalOpen(false)}>
              Batal
            </Button>
            <Button className="flex-1" onClick={saveCategory} disabled={saving || !categoryName.trim()}>
              {saving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Product Modal */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title={editingProduct ? 'Edit Produk' : 'Tambah Produk'}
      >
        <div className="space-y-4">
          <Input
            label="Nama"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Contoh: Cappuccino"
          />
          <Input
            label="Harga (IDR)"
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            placeholder="Contoh: 35000"
          />
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Kategori
            </label>
            <select
              value={productCategoryId}
              onChange={(e) => setProductCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <option value="">Tanpa Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <ProductModifierSelector
            productId={editingProduct?.id}
            selectedGroupIds={productModifierGroupIds}
            onChange={setProductModifierGroupIds}
          />

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setIsProductModalOpen(false)}>
              Batal
            </Button>
            <Button className="flex-1" onClick={saveProduct} disabled={saving || !productName.trim() || !productPrice}>
              {saving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
