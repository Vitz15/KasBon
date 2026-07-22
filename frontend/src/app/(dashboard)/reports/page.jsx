'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import ReportChart from '@/components/reports/ReportChart';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Loading from '@/components/ui/Loading';
import ErrorState from '@/components/ui/ErrorState';
import { formatCurrency, formatDate } from '@/lib/utils';
import { FileText, Download, Calendar } from 'lucide-react';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('sales');

  // Date Filters
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days ago
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const [salesSummary, setSalesSummary] = useState(null);
  const [debtSummary, setDebtSummary] = useState(null);
  const [stockSummary, setStockSummary] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports/sales', { params: { start_date: startDate, end_date: endDate } });
      setSalesSummary(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat laporan penjualan');
    } finally {
      setLoading(false);
    }
  };

  const fetchDebtData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports/debts');
      setDebtSummary(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat laporan buku kasbon');
    } finally {
      setLoading(false);
    }
  };

  const fetchStockData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports/stock');
      setStockSummary(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat laporan inventaris');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'sales') fetchSalesData();
    if (activeTab === 'debts') fetchDebtData();
    if (activeTab === 'stock') fetchStockData();
  }, [activeTab, startDate, endDate]);

  const handleExportExcel = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/v1/reports/export/excel?start_date=${startDate}&end_date=${endDate}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `laporan-penjualan-${startDate}-${endDate}.csv`;
    link.click();
  };

  const handleExportPdf = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/v1/reports/export/pdf?start_date=${startDate}&end_date=${endDate}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const html = await response.text();
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.print();
  };

  const tabBtn = (isActive) =>
    `px-3 py-1.5 text-[12.5px] font-medium rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
      isActive ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
    }`;

  const dateInputCls = 'text-xs border border-slate-300 rounded-lg py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 bg-white';

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Laporan Keuangan & Statistik</h2>
          <p className="text-xs text-slate-500 mt-0.5">Pantau omzet harian, sisa saldo kasbon, perputaran stok barang, dan ekspor data</p>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-slate-100 p-1 rounded-lg self-start md:self-center">
          <button onClick={() => setActiveTab('sales')} className={tabBtn(activeTab === 'sales')}>Penjualan</button>
          <button onClick={() => setActiveTab('debts')} className={tabBtn(activeTab === 'debts')}>Buku KasBon</button>
          <button onClick={() => setActiveTab('stock')} className={tabBtn(activeTab === 'stock')}>Stok Barang</button>
        </div>
      </div>

      {/* Date Filters & Export Buttons */}
      {activeTab === 'sales' && (
        <Card className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Mulai Tanggal</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={dateInputCls}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Hingga Tanggal</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={dateInputCls}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportExcel} className="flex items-center space-x-1.5">
              <Download className="h-3.5 w-3.5" /> <span>Ekspor CSV</span>
            </Button>
            <Button size="sm" onClick={handleExportPdf} className="flex items-center space-x-1.5">
              <FileText className="h-3.5 w-3.5" /> <span>Print Laporan</span>
            </Button>
          </div>
        </Card>
      )}

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={() => {
          if (activeTab === 'sales') fetchSalesData();
          if (activeTab === 'debts') fetchDebtData();
          if (activeTab === 'stock') fetchStockData();
        }} />
      ) : (
        <div className="space-y-5">
          {activeTab === 'sales' && salesSummary && (
            <div className="space-y-5">
              {/* Stat grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Card>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Total Penjualan</p>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1.5 tabular-nums">{formatCurrency(salesSummary.total_sales)}</h3>
                </Card>
                <Card>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Omzet Tunai</p>
                  <h3 className="text-xl font-extrabold text-emerald-600 mt-1.5 tabular-nums">{formatCurrency(salesSummary.cash_sales)}</h3>
                </Card>
                <Card>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Omzet KasBon</p>
                  <h3 className="text-xl font-extrabold text-rose-600 mt-1.5 tabular-nums">{formatCurrency(salesSummary.kasbon_sales)}</h3>
                </Card>
              </div>

              {/* Chart */}
              <Card title="Barang Paling Laris (Top 5)">
                <ReportChart data={salesSummary.top_products} />
              </Card>
            </div>
          )}

          {activeTab === 'debts' && debtSummary && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Card>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Hutang Aktif Tersisa</p>
                  <h3 className="text-xl font-extrabold text-rose-600 mt-1.5 tabular-nums">{formatCurrency(debtSummary.active_debt_remaining)}</h3>
                </Card>
                <Card>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Hutang Sudah Dilunasi</p>
                  <h3 className="text-xl font-extrabold text-emerald-600 mt-1.5 tabular-nums">{formatCurrency(debtSummary.total_debt_paid)}</h3>
                </Card>
                <Card>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Total Tercatat</p>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1.5 tabular-nums">{formatCurrency(debtSummary.total_debt_recorded)}</h3>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <Card title="Pelanggan Top Hutang">
                  <div className="divide-y divide-slate-100">
                    {debtSummary.top_customers.map((c, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0 text-[13px]">
                        <span className="font-medium text-slate-700">{c.name}</span>
                        <span className="font-semibold text-rose-600 tabular-nums">{formatCurrency(c.active_debt)}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="Hutang Jatuh Tempo / Telat Bayar">
                  <div className="divide-y divide-slate-100">
                    {debtSummary.overdue.length > 0 ? (
                      debtSummary.overdue.map((d, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
                          <div>
                            <span className="font-semibold text-slate-800 text-[13px] block">{d.customer?.name}</span>
                            <span className="text-[11px] text-rose-500 font-medium">Jatuh Tempo: {formatDate(d.due_date)}</span>
                          </div>
                          <span className="font-semibold text-rose-600 text-[13px] tabular-nums">{formatCurrency(d.remaining)}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-6 text-slate-400 text-xs">Tidak ada hutang yang telat jatuh tempo</p>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'stock' && stockSummary && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Card>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Nilai Aset (Harga Modal)</p>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1.5 tabular-nums">{formatCurrency(stockSummary.inventory_cost_value)}</h3>
                </Card>
                <Card>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Nilai Jual</p>
                  <h3 className="text-xl font-extrabold text-primary-700 mt-1.5 tabular-nums">{formatCurrency(stockSummary.inventory_selling_value)}</h3>
                </Card>
                <Card>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Potensi Keuntungan</p>
                  <h3 className="text-xl font-extrabold text-emerald-600 mt-1.5 tabular-nums">{formatCurrency(stockSummary.potential_profit)}</h3>
                </Card>
              </div>

              <Card title="Daftar Barang Perlu Di-restock">
                <div className="divide-y divide-slate-100">
                  {stockSummary.low_stock_items.length > 0 ? (
                    stockSummary.low_stock_items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
                        <div>
                          <span className="font-semibold text-slate-800 text-[13px] block">{item.name}</span>
                          <span className="text-[11px] text-slate-400">Pemasok: {item.supplier?.name || 'Umum'}</span>
                        </div>
                        <span className="font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full text-[11px] tabular-nums">
                          Sisa: {item.stock} {item.unit}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-6 text-slate-400 text-xs">Semua stok barang aman (di atas batas minimum)</p>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
