'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CartItem } from '@/types';
import { useSettingsStore } from '@/stores/settingsStore';
import { formatCurrency } from '@/lib/formatters';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onConfirm: (paymentMethod: string) => Promise<void>;
}

export function PaymentModal({ isOpen, onClose, items, total, onConfirm }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [loading, setLoading] = useState(false);
  const { currency } = useSettingsStore();

  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: '💵' },
    { id: 'card', label: 'Card', icon: '💳' },
    { id: 'qris', label: 'QRIS', icon: '📱' },
  ];

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(paymentMethod);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payment">
      <div className="space-y-6">
        <div className="bg-[var(--bg-card)] rounded-lg p-4">
          <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">Order Summary</h3>
          <ul className="space-y-2 mb-4 max-h-40 overflow-y-auto">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span className="text-[var(--text-primary)]">
                  {item.quantity}x {item.product.name}
                </span>
                <span className="text-[var(--text-secondary)]">{formatCurrency(item.subtotal, currency)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-[var(--border)] pt-3 flex justify-between">
            <span className="font-semibold text-[var(--text-primary)]">Total</span>
            <span className="font-bold text-[var(--accent)] text-lg">{formatCurrency(total, currency)}</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">Payment Method</h3>
          <div className="grid grid-cols-3 gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`p-4 rounded-lg border-2 text-center transition-colors ${
                  paymentMethod === method.id
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                    : 'border-[var(--border)] hover:border-[var(--text-secondary)]'
                }`}
              >
                <span className="text-2xl block mb-1">{method.icon}</span>
                <span className="text-sm font-medium text-[var(--text-primary)]">{method.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Processing...' : `Pay ${formatCurrency(total, currency)}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
