'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';
import { useToastStore } from '@/stores/toastStore';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectionModal({ isOpen, onClose }: ConnectionModalProps) {
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { showToast } = useToastStore();
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const maskedUrl = url.replace(/(https:\/\/)([^.]+)(.+)/, '$1****$3');

  const checkConnection = async () => {
    setChecking(true);
    setStatus('idle');
    try {
      const { error } = await supabase.from('settings').select('count').limit(1).single();
      if (error && error.code !== 'PGRST116') throw error;
      
      setStatus('success');
      showToast('Connection successful!', 'success');
    } catch (error) {
      console.error('Connection check failed:', error);
      setStatus('error');
      showToast('Connection failed', 'error');
    } finally {
      setChecking(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Database Connection">
      <div className="space-y-6">
        <div className="bg-[var(--bg-card)] p-4 rounded-lg border border-[var(--border)]">
          <label className="text-xs text-[var(--text-secondary)] uppercase font-semibold block mb-2">
            Supabase Project URL
          </label>
          <div className="flex items-center gap-2 font-mono text-sm text-[var(--text-primary)]">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            {maskedUrl}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-[var(--bg-card)] rounded-lg">
          <span className="text-[var(--text-primary)] font-medium">Status</span>
          {status === 'idle' && <span className="text-[var(--text-secondary)]">Ready to check</span>}
          {status === 'success' && <span className="text-green-500 font-bold">Connected ✅</span>}
          {status === 'error' && <span className="text-[var(--danger)] font-bold">Error ❌</span>}
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button className="flex-1" onClick={checkConnection} disabled={checking}>
            {checking ? 'Checking...' : 'Test Connection'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
