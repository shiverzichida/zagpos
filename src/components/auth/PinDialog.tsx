'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';

interface PinDialogProps {
  onSubmit: (pin: string) => void;
  onCancel: () => void;
  error?: string;
}

export function PinDialog({ onSubmit, onCancel, error }: PinDialogProps) {
  const [pin, setPin] = useState('');

  const handleKeyPress = useCallback((key: string) => {
    if (key === 'delete') {
      setPin((prev) => prev.slice(0, -1));
    } else if (key === 'clear') {
      setPin('');
    } else if (pin.length < 6) {
      setPin((prev) => prev + key);
    }
  }, [pin.length]);

  const handleSubmit = () => {
    if (pin.length === 6) {
      onSubmit(pin);
    }
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'delete'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] shadow-2xl p-8 w-full max-w-sm mx-4">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Masukkan PIN</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Masukkan 6 digit PIN untuk melanjutkan</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[var(--danger)]/10 border border-[var(--danger)]/20 rounded-lg text-[var(--danger)] text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-colors ${
                pin.length > i
                  ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                  : 'border-[var(--border)] bg-[var(--bg-card)]'
              }`}
            >
              {pin.length > i ? '•' : ''}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {keys.map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className={`h-14 rounded-xl font-semibold text-lg transition-colors ${
                key === 'clear' || key === 'delete'
                  ? 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] text-sm'
                  : 'bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-white'
              }`}
            >
              {key === 'delete' ? '⌫' : key === 'clear' ? 'C' : key}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            Batal
          </Button>
          <Button className="flex-1" onClick={handleSubmit} disabled={pin.length !== 6}>
            Konfirmasi
          </Button>
        </div>
      </div>
    </div>
  );
}
