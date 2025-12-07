'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useSettingsStore } from '@/stores/settingsStore';
import { formatCurrency } from '@/lib/formatters';
import { Input } from '@/components/ui/Input';

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
}

interface OrderItemDetail {
  id: string;
  product_id: string;
  quantity: number;
  modifiers: { modifier_name: string; price_adjustment: number }[];
  subtotal: number;
  product?: { name: string };
}

export default function TransactionsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItemDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { currency } = useSettingsStore();

  useEffect(() => {
    fetchOrders();
  }, [startDate, endDate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (startDate) {
        query = query.gte('created_at', `${startDate}T00:00:00`);
      }
      if (endDate) {
        query = query.lte('created_at', `${endDate}T23:59:59`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (order: Order) => {
    setSelectedOrder(order);
    setDetailLoading(true);
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*, product:products(name)')
        .eq('order_id', order.id);

      if (error) {
        console.error('Error fetching order items:', error);
      } else {
        setOrderItems(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'pending': return 'Menunggu';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
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
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Transaksi</h1>
          <p className="text-[var(--text-secondary)]">Riwayat pesanan</p>
        </div>
        
        <div className="flex gap-2">
          <Input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            className="w-auto"
          />
          <span className="self-center text-[var(--text-secondary)]">-</span>
          <Input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            className="w-auto"
          />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-[var(--text-secondary)]">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-lg font-medium">Belum ada transaksi</p>
          <p className="text-sm">Transaksi yang selesai akan muncul di sini</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} hover className="p-4" onClick={() => fetchOrderDetails(order)}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--text-primary)]">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[var(--accent)]">{formatCurrency(order.total, currency)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {translateStatus(order.status)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order #${selectedOrder?.id.slice(0, 8)}`}
      >
        {detailLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-[var(--bg-card)] rounded-lg p-4">
              <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">Item Pesanan</h3>
              <ul className="space-y-2">
                {orderItems.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm">
                    <div>
                      <span className="text-[var(--text-primary)]">
                        {item.quantity}x {item.product?.name || 'Produk Tidak Dikenal'}
                      </span>
                      {item.modifiers && item.modifiers.length > 0 && (
                        <p className="text-xs text-[var(--text-secondary)]">
                          {item.modifiers.map((m) => m.modifier_name).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="text-[var(--text-secondary)]">{formatCurrency(item.subtotal, currency)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[var(--border)]">
              <span className="font-semibold text-[var(--text-primary)]">Total</span>
              <span className="font-bold text-[var(--accent)] text-lg">
                {formatCurrency(selectedOrder?.total || 0, currency)}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--text-secondary)]">Tanggal</span>
              <span className="text-[var(--text-primary)]">
                {selectedOrder && formatDate(selectedOrder.created_at)}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--text-secondary)]">Status</span>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder?.status || '')}`}>
                {translateStatus(selectedOrder?.status || '')}
              </span>
            </div>

            <Button variant="secondary" className="w-full" onClick={() => setSelectedOrder(null)}>
              Tutup
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
