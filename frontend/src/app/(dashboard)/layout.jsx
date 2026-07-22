'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Loading from '@/components/ui/Loading';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { user, token, initialize } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    initialize();
    
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.replace('/login');
    } else {
      setChecking(false);
    }
  }, [router, initialize]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}