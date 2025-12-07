import { Card } from '@/components/ui/Card';

export default function AccountPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Akun</h1>
        <p className="text-[var(--text-secondary)]">Kelola pengaturan akun Anda</p>
      </div>

      <Card className="p-8 max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-[var(--accent)] rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-[var(--text-primary)] text-lg">Kasir</h2>
            <p className="text-[var(--text-secondary)]">cashier@store.com</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-[var(--border)]">
            <span className="text-[var(--text-secondary)]">Peran</span>
            <span className="text-[var(--text-primary)]">Kasir</span>
          </div>
          <div className="flex justify-between py-3 border-b border-[var(--border)]">
            <span className="text-[var(--text-secondary)]">Toko</span>
            <span className="text-[var(--text-primary)]">Toko Utama</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-[var(--text-secondary)]">Status</span>
            <span className="text-green-500">Aktif</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
