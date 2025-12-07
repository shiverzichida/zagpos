'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center p-4 border-b border-[var(--border)] bg-[var(--bg-secondary)] sticky top-0 z-20">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-card)] rounded-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="ml-3 font-bold text-lg text-[var(--text-primary)]">ZAG POS</span>
      </div>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className="md:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
