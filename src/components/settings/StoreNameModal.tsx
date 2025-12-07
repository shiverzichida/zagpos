'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useSettingsStore } from '@/stores/settingsStore';
import { useToastStore } from '@/stores/toastStore';

interface StoreNameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StoreNameModal({ isOpen, onClose }: StoreNameModalProps) {
  const { storeName, updateStoreName } = useSettingsStore();
  const { showToast } = useToastStore();
  const [name, setName] = useState(storeName);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      await updateStoreName(name);
      showToast('Store name updated', 'success');
      onClose();
    } catch {
      showToast('Failed to update store name', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Store Name">
      <div className="space-y-4">
        <Input
          label="Store Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter store name"
        />
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSubmit} disabled={loading || !name.trim()}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
