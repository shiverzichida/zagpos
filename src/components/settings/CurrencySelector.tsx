'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useSettingsStore } from '@/stores/settingsStore';
import { useToastStore } from '@/stores/toastStore';
import { SUPPORTED_CURRENCIES } from '@/lib/formatters';

interface CurrencySelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CurrencySelector({ isOpen, onClose }: CurrencySelectorProps) {
  const { currency, updateCurrency } = useSettingsStore();
  const { showToast } = useToastStore();

  const handleSelect = async (code: string) => {
    try {
      await updateCurrency(code);
      showToast('Currency updated', 'success');
      onClose();
    } catch {
      showToast('Failed to update currency', 'error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Currency">
      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {SUPPORTED_CURRENCIES.map((c) => (
          <button
            key={c.code}
            onClick={() => handleSelect(c.code)}
            className={`w-full p-4 rounded-lg border text-left flex items-center justify-between transition-colors ${
              currency === c.code
                ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                : 'border-[var(--border)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            <div>
              <p className="font-medium text-[var(--text-primary)]">
                {c.name} ({c.code})
              </p>
            </div>
            <span className="text-xl font-bold text-[var(--text-secondary)]">{c.symbol}</span>
          </button>
        ))}
        <div className="pt-4">
          <Button variant="secondary" className="w-full" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
