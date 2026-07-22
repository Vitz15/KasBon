'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const getPageTitle = () => {
    if (pathname.startsWith('/dashboard')) return 'Dashboard Toko';
    if (pathname.startsWith('/sales')) return 'Kasir (POS)';
    if (pathname.startsWith('/inventory')) return 'Manajemen Inventaris';
    if (pathname.startsWith('/customers')) return 'Daftar Pelanggan';
    if (pathname.startsWith('/debts')) return 'Buku Hutang / KasBon';
    if (pathname.startsWith('/reports')) return 'Laporan Keuangan';
    return 'KasBon Digital';
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
      <h1 className="text-lg font-bold text-slate-800">{getPageTitle()}</h1>

      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-xs">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="text-left hidden sm:block">
          <h4 className="text-xs font-bold text-slate-700">{user?.name}</h4>
          <p className="text-[10px] text-slate-400 capitalize font-medium">{user?.role}</p>
        </div>
      </div>
    </header>
  );
}