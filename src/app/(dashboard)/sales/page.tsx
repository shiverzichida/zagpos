'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Category, Product } from '@/types';
import { useOrderStore } from '@/stores/orderStore';
import { useToastStore } from '@/stores/toastStore';
import { CategoryFilter } from '@/components/pos/CategoryFilter';
import { ProductGrid } from '@/components/pos/ProductGrid';
import { CurrentOrder } from '@/components/pos/CurrentOrder';
import { ModifierModal } from '@/components/pos/ModifierModal';
import { PaymentModal } from '@/components/pos/PaymentModal';

// Demo data for when database is empty
const demoCategories: Category[] = [
  { id: '1', name: 'Coffee', icon: '☕', created_at: new Date().toISOString() },
  { id: '2', name: 'Food', icon: '🍔', created_at: new Date().toISOString() },
  { id: '3', name: 'Drinks', icon: '🥤', created_at: new Date().toISOString() },
];

const demoProducts: Product[] = [
  { id: '1', name: 'Espresso', price: 25000, category_id: '1', image_url: null, created_at: new Date().toISOString() },
  { id: '2', name: 'Cappuccino', price: 35000, category_id: '1', image_url: null, created_at: new Date().toISOString() },
  { id: '3', name: 'Latte', price: 38000, category_id: '1', image_url: null, created_at: new Date().toISOString() },
  { id: '4', name: 'Americano', price: 28000, category_id: '1', image_url: null, created_at: new Date().toISOString() },
  { id: '5', name: 'Mocha', price: 42000, category_id: '1', image_url: null, created_at: new Date().toISOString() },
  { id: '6', name: 'Croissant', price: 22000, category_id: '2', image_url: null, created_at: new Date().toISOString() },
  { id: '7', name: 'Sandwich', price: 35000, category_id: '2', image_url: null, created_at: new Date().toISOString() },
  { id: '8', name: 'Pasta', price: 45000, category_id: '2', image_url: null, created_at: new Date().toISOString() },
  { id: '9', name: 'Iced Tea', price: 18000, category_id: '3', image_url: null, created_at: new Date().toISOString() },
  { id: '10', name: 'Lemonade', price: 22000, category_id: '3', image_url: null, created_at: new Date().toISOString() },
  { id: '11', name: 'Orange Juice', price: 25000, category_id: '3', image_url: null, created_at: new Date().toISOString() },
  { id: '12', name: 'Mineral Water', price: 10000, category_id: '3', image_url: null, created_at: new Date().toISOString() },
];

export default function SalesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModifierModalOpen, setIsModifierModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { items, addItem, getTotal, clearCart } = useOrderStore();
  const { showToast } = useToastStore();

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

      if (categoriesRes.data && categoriesRes.data.length > 0) {
        setCategories(categoriesRes.data);
      } else {
        setCategories(demoCategories);
      }

      if (productsRes.data && productsRes.data.length > 0) {
        setProducts(productsRes.data);
      } else {
        setProducts(demoProducts);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setCategories(demoCategories);
      setProducts(demoProducts);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModifierModalOpen(true);
  };

  const handleAddToOrder = (product: Product, modifiers: import('@/types').SelectedModifier[]) => {
    addItem(product, modifiers);
  };

  const handlePay = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentConfirm = async () => {
    try {
      const totalAmount = getTotal();
      
      // Create order in database
      // user_id will be set by database default (auth.uid())
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          total: totalAmount,
          status: 'completed',
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        showToast('Gagal menyimpan pesanan ke database', 'error');
        return;
      }

      if (order) {
        const orderItems = items.map((item) => ({
          order_id: order.id,
          product_id: item.product.id,
          quantity: item.quantity,
          modifiers: item.modifiers,
          subtotal: item.subtotal,
        }));

        await supabase.from('order_items').insert(orderItems);
      }

      clearCart();
      setIsPaymentModalOpen(false);
      
      showToast(`Pembayaran berhasil! Total: Rp ${totalAmount.toLocaleString('id-ID')}`, 'success');
    } catch (error) {
      console.error('Payment error:', error);
      showToast('Pembayaran gagal. Silakan coba lagi.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="lg:pr-96 min-h-screen pb-24 lg:pb-0">
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Penjualan</h1>
          <p className="text-[var(--text-secondary)]">Pilih produk untuk ditambahkan ke pesanan</p>
        </div>

        <div className="mb-6">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        <ProductGrid products={filteredProducts} onProductClick={handleProductClick} />
      </div>

      <CurrentOrder onPay={handlePay} />

      <ModifierModal
        isOpen={isModifierModalOpen}
        onClose={() => setIsModifierModalOpen(false)}
        product={selectedProduct}
        onAddToOrder={handleAddToOrder}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        items={items}
        total={getTotal()}
        onConfirm={handlePaymentConfirm}
      />
    </div>
  );
}
