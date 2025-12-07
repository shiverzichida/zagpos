'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { PinDialog } from '@/components/auth/PinDialog';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const router = useRouter();
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pinError, setPinError] = useState('');

  const handleLoginSuccess = () => {
    setShowPinDialog(true);
  };

  const handlePinSubmit = (pin: string) => {
    // For demo purposes, accept any 6-digit PIN
    // In production, validate against user's stored PIN
    if (pin.length === 6) {
      // Use window.location for hard navigation to ensure middleware & auth state sync
      window.location.href = '/sales';
    } else {
      setPinError('Invalid PIN');
    }
  };

  const handlePinCancel = () => {
    setShowPinDialog(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
      <div className="w-full max-w-md">
        <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-8 shadow-xl">
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
      </div>

      {showPinDialog && (
        <PinDialog
          onSubmit={handlePinSubmit}
          onCancel={handlePinCancel}
          error={pinError}
        />
      )}
    </div>
  );
}
