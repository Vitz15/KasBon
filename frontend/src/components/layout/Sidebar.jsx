'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Receipt,
  FileText,
  LogOut,
  X
} from 'lucide-react';

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'POS / Kasir', path: '/sales', icon: ShoppingCart },
    { name: 'Inventaris', path: '/inventory', icon: Package },
    { name: 'Pelanggan', path: '/customers', icon: Users },
    { name: 'Buku KasBon', path: '/debts', icon: Receipt },
  ];

  // Reports accessible to Owner only
  if (user?.role === 'owner') {
    menuItems.push({ name: 'Laporan Keuangan', path: '/reports', icon: FileText });
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
        />
      )}

      <aside
        className={cn(
          'w-60 bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between border-r border-white/[0.06]',
          'fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-in-out',
          'lg:static lg:translate-x-0 lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-white/[0.06]">
            <Link
              href="/dashboard"
              onClick={onClose}
              className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              <img src="/logo.png" alt="KasBon Logo" className="w-7 h-7 object-contain flex-shrink-0" />
              <span className="text-[13.5px] font-semibold text-white tracking-tight">KasBon Digital</span>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md text-slate-400 hover:bg-white/[0.05] hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="px-3 pt-5 space-y-0.5">
            <p className="px-2.5 pb-2 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Menu</p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={onClose}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'group flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[13px] font-medium transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
                    isActive
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-sm shadow-primary-950/40'
                      : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-100'
                  )}
                >
                  <Icon className={cn('h-[17px] w-[17px] flex-shrink-0', isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300')} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-white/[0.06] space-y-0.5">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-md">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-[11px] flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <h4 className="text-[13px] font-medium text-white truncate leading-tight">{user?.name}</h4>
              <p className="text-[11px] text-slate-500 capitalize leading-tight">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2.5 w-full px-2.5 py-[7px] rounded-md text-[13px] font-medium text-slate-400 hover:bg-white/[0.05] hover:text-rose-400 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            <LogOut className="h-[17px] w-[17px]" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}