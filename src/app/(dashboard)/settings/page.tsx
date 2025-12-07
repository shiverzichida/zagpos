'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useSettingsStore } from '@/stores/settingsStore';
import { StoreNameModal } from '@/components/settings/StoreNameModal';
import { CurrencySelector } from '@/components/settings/CurrencySelector';
import { ConnectionModal } from '@/components/settings/ConnectionModal';

export default function SettingsPage() {
  const { storeName, currency, theme, autoPrint, updateTheme, toggleAutoPrint } = useSettingsStore();
  
  const [modals, setModals] = useState({
    storeName: false,
    currency: false,
    connection: false,
  });

  const toggleModal = (key: keyof typeof modals, value: boolean) => {
    setModals(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Pengaturan</h1>
        <p className="text-[var(--text-secondary)]">Konfigurasi sistem POS Anda</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* General Settings */}
        <Card className="p-6">
          <h2 className="font-semibold text-[var(--text-primary)] mb-4">Umum</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Nama Toko</p>
                <p className="text-sm text-[var(--text-secondary)]">{storeName}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => toggleModal('storeName', true)}>
                Ubah
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Mata Uang</p>
                <p className="text-sm text-[var(--text-secondary)]">{currency}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => toggleModal('currency', true)}>
                Ubah
              </Button>
            </div>
          </div>
        </Card>

        {/* Display Settings */}
        <Card className="p-6">
          <h2 className="font-semibold text-[var(--text-primary)] mb-4">Tampilan</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Tema</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {theme === 'dark' ? 'Mode gelap aktif' : 'Mode terang aktif'}
                </p>
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => updateTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                Ganti ke {theme === 'dark' ? 'Terang' : 'Gelap'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Receipt Settings */}
        <Card className="p-6">
          <h2 className="font-semibold text-[var(--text-primary)] mb-4">Struk</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Cetak Otomatis</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {autoPrint ? 'Cetak otomatis setelah pembayaran' : 'Jangan cetak otomatis'}
                </p>
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={toggleAutoPrint}
                className={autoPrint ? 'text-[var(--accent)]' : ''}
              >
                {autoPrint ? 'Aktif' : 'Nonaktif'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Database Settings */}
        <Card className="p-6">
          <h2 className="font-semibold text-[var(--text-primary)] mb-4">Database</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Koneksi Supabase</p>
                <p className="text-sm text-green-500">Terkonfigurasi</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => toggleModal('connection', true)}>
                Tes Koneksi
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Modals */}
      <StoreNameModal 
        isOpen={modals.storeName} 
        onClose={() => toggleModal('storeName', false)} 
      />
      
      <CurrencySelector 
        isOpen={modals.currency} 
        onClose={() => toggleModal('currency', false)} 
      />

      <ConnectionModal 
        isOpen={modals.connection} 
        onClose={() => toggleModal('connection', false)} 
      />
    </div>
  );
}
