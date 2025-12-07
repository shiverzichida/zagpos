'use client';

import { CartItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { useOrderStore } from '@/stores/orderStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { formatCurrency } from '@/lib/formatters';

interface CurrentOrderProps {
  onPay: () => void;
}

export function CurrentOrder({ onPay }: CurrentOrderProps) {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useOrderStore();
  const { currency } = useSettingsStore();

  const total = getTotal();

  return (
    <div className="w-96 bg-[var(--bg-secondary)] border-l border-[var(--border)] flex flex-col h-screen fixed right-0 top-0">
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Pesanan</h2>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-sm text-[var(--danger)] hover:underline"
          >
            Hapus
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[var(--text-secondary)]">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-lg font-medium">Belum ada item</p>
            <p className="text-sm">Pilih produk untuk menambahkan</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <OrderItemRow
                key={item.id}
                item={item}
                onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                onRemove={() => removeItem(item.id)}
                currency={currency}
              />
            ))}
          </ul>
        )}
      </div>

      <div className="p-4 border-t border-[var(--border)] space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[var(--text-secondary)]">Subtotal</span>
          <span className="text-[var(--text-primary)] font-medium">{formatCurrency(total, currency)}</span>
        </div>
        <div className="flex justify-between items-center text-lg">
          <span className="font-semibold text-[var(--text-primary)]">Total</span>
          <span className="font-bold text-[var(--accent)]">{formatCurrency(total, currency)}</span>
        </div>
        <Button
          className="w-full"
          size="lg"
          disabled={items.length === 0}
          onClick={onPay}
        >
          Bayar {formatCurrency(total, currency)}
        </Button>
      </div>
    </div>
  );
}

interface OrderItemRowProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  currency: string;
}

function OrderItemRow({ item, onUpdateQuantity, onRemove, currency }: OrderItemRowProps) {
  return (
    <li className="bg-[var(--bg-card)] rounded-lg p-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-[var(--text-primary)] text-sm truncate">
            {item.product.name}
          </h4>
          {item.modifiers.length > 0 && (
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {item.modifiers.map((m) => m.modifier_name).join(', ')}
            </p>
          )}
        </div>
        <button
          onClick={onRemove}
          className="text-[var(--text-secondary)] hover:text-[var(--danger)] ml-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            className="w-7 h-7 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-white transition-colors flex items-center justify-center"
          >
            -
          </button>
          <span className="w-8 text-center text-sm font-medium text-[var(--text-primary)]">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            className="w-7 h-7 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-white transition-colors flex items-center justify-center"
          >
            +
          </button>
        </div>
        <span className="font-semibold text-[var(--accent)] text-sm">
          {formatCurrency(item.subtotal, currency)}
        </span>
      </div>
    </li>
  );
}
