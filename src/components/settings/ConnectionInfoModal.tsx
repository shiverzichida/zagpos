'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface ConnectionInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectionInfoModal({ isOpen, onClose }: ConnectionInfoModalProps) {
  const [status, setStatus] = useState<'idle' | 'checking' | 'connected' | 'error'>('idle');
  
  const checkConnection = async () => {
    setStatus('checking');
    try {
      const { error } = await supabase.from('settings').select('count').single();
      if (error && error.code !== 'PGRST116') throw error;
      setStatus('connected');
    } catch {
      setStatus('error');
    }
  };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const maskedUrl = url.replace(/(https:\/\/[^.]+)\..+/, '$1.supabase.co');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Database Connection">
      <div className="space-y-6">
        <div className="bg-[var(--bg-card)] p-4 rounded-lg space-y-3">
          <div>
            <p className="text-xs text-[var(--text-secondary)] uppercase font-semibold mb-1">Project URL</p>
            <p className="text-[var(--text-primary)] font-mono text-sm break-all">{maskedUrl}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)] uppercase font-semibold mb-1">Status</p>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                status === 'connected' ? 'bg-green-500' : 
                status === 'error' ? 'bg-red-500' : 
                status === 'checking' ? 'bg-yellow-500 animate-pulse' :
                'bg-gray-500'
              }`} />
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {status === 'idle' ? 'Unknown' : 
                 status === 'checking' ? 'Checking...' : 
                 status === 'connected' ? 'Connected' : 'Connection Failed'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button className="flex-1" onClick={checkConnection} disabled={status === 'checking'}>
            Test Connection
          </Button>
        </div>
      </div>
    </Modal>
  );
}
