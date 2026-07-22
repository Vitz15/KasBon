'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import StatCard from '@/components/dashboard/StatCard';
import SalesChart from '@/components/dashboard/SalesChart';
import DebtChart from '@/components/dashboard/DebtChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import Loading from '@/components/ui/Loading';
import ErrorState from '@/components/ui/ErrorState';
import Card from '@/components/ui/Card';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@/lib/utils';
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Receipt,
  BarChart3
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/dashboard');
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={fetchDashboardData} />;

  const { summary, recent_sales, top_debtors, chart_sales } = data || {};

  const totalSalesPeriod = (chart_sales?.data || []).reduce((sum, v) => sum + (Number(v) || 0), 0);
  const totalTopDebt = (top_debtors || []).reduce((sum, d) => sum + (Number(d.active_debt) || 0), 0);
  const todayLabel = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Halo, {user?.name?.split(' ')[0] || 'Pengguna'}</h2>
          <p className="text-sm text-slate-400 mt-0.5 capitalize">{todayLabel}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total KasBon Aktif"
          value={formatCurrency(summary?.total_active_debt)}
          icon={<Receipt className="h-6 w-6" />}
          color="danger"
          description="Total piutang yang belum lunas"
        />
        <StatCard
          title="Pelanggan Berhutang"
          value={`${summary?.customers_with_debt} Orang`}
          icon={<Users className="h-6 w-6" />}
          color="warning"
          description="Pelanggan dengan hutang aktif"
        />
        <StatCard
          title="Pendapatan Hari Ini"
          value={formatCurrency(summary?.today_sales)}
          icon={<TrendingUp className="h-6 w-6" />}
          color="success"
          description="Total omzet penjualan hari ini"
        />
        <StatCard
          title="Stok Menipis / Habis"
          value={`${summary?.low_stock_count} Produk`}
          icon={<AlertTriangle className="h-6 w-6" />}
          color={summary?.low_stock_count > 0 ? 'danger' : 'primary'}
          description="Perlu segera restock barang"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card
            title={
              <span className="inline-flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600 inline-flex">
                  <BarChart3 className="h-4 w-4" />
                </span>
                Omzet Penjualan (7 Hari Terakhir)
              </span>
            }
            subtitle={`Total ${formatCurrency(totalSalesPeriod)} dalam periode ini`}
          >
            <SalesChart data={chart_sales} />
          </Card>
        </div>
        <div>
          <Card
            title={
              <span className="inline-flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 inline-flex">
                  <Receipt className="h-4 w-4" />
                </span>
                Top 5 Hutang Pelanggan
              </span>
            }
            subtitle={totalTopDebt > 0 ? `Total ${formatCurrency(totalTopDebt)}` : undefined}
          >
            <DebtChart data={top_debtors} />
          </Card>
        </div>
      </div>

      <Card title="Transaksi Terbaru" subtitle="5 transaksi paling baru masuk">
        <RecentTransactions transactions={recent_sales} />
      </Card>
    </div>
  );
}