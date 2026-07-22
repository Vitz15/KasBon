'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import Loading from '@/components/ui/Loading';
import ErrorState from '@/components/ui/ErrorState';
import Card from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Eye, ArrowRight, Calendar, AlertCircle } from 'lucide-react';

export default function DebtsPage() {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchDebts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/debts', {
        params: { status: statusFilter !== 'all' ? statusFilter : undefined }
      });
      setDebts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat catatan KasBon');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, [statusFilter]);

  const isOverdue = (dueDate, status) => {
    if (status === 'paid' || !dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
  };

  const columns = [
    {
      header: 'Pelanggan',
      accessor: 'customer',
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-[11px] flex-shrink-0">
            {row.customer?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <Link href={`/customers/${row.customer?.id}`} className="font-semibold text-slate-800 hover:text-primary-600 block transition-colors">
              {row.customer?.name}
            </Link>
            <span className="text-[11px] text-slate-400">{row.customer?.phone || '-'}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Deskripsi / Ref',
      accessor: 'description',
      cell: (row) => <span className="text-slate-500 text-[13px] max-w-[150px] truncate block">{row.description || '-'}</span>
    },
    {
      header: 'Jumlah Hutang',
      accessor: 'amount',
      cell: (row) => <span className="font-medium text-slate-600 tabular-nums">{formatCurrency(row.amount)}</span>
    },
    {
      header: 'Sisa Hutang',
      accessor: 'remaining',
      cell: (row) => (
        <span className={`tabular-nums ${row.status === 'paid' ? 'text-slate-400 font-medium' : 'font-semibold text-rose-600'}`}>
          {formatCurrency(row.remaining)}
        </span>
      )
    },
    {
      header: 'Jatuh Tempo',
      accessor: 'due_date',
      cell: (row) => {
        const overdue = isOverdue(row.due_date, row.status);
        return (
          <div className="flex items-center gap-1.5 text-[13px]">
            <Calendar className={`h-3.5 w-3.5 ${overdue ? 'text-rose-500' : 'text-slate-400'}`} />
            <span className={overdue ? 'text-rose-600 font-semibold' : 'text-slate-500 font-medium'}>
              {formatDate(row.due_date)}
            </span>
            {overdue && (
              <Badge variant="danger" className="text-[9px] px-1.5 py-0">Telat</Badge>
            )}
          </div>
        );
      }
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => {
        const overdue = isOverdue(row.due_date, row.status);
        return (
          <Badge variant={
            row.status === 'paid' ? 'success' :
            overdue ? 'danger' :
            row.status === 'partial' ? 'warning' : 'danger'
          }>
            {row.status === 'paid' ? 'Lunas' :
             overdue ? 'Jatuh Tempo' :
             row.status === 'partial' ? 'Dicicil' : 'Belum Lunas'}
          </Badge>
        );
      }
    },
    {
      header: 'Aksi',
      cell: (row) => (
        <Link
          href={`/debts/${row.id}`}
          className="inline-flex items-center justify-center p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-primary-600 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      )
    }
  ];

  const tabBtn = (isActive) =>
    `px-3 py-1.5 text-[12.5px] font-medium rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
      isActive ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
    }`;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Buku KasBon Digital</h2>
          <p className="text-xs text-slate-500 mt-0.5">Daftar semua piutang warung, status pembayaran, dan pengingat jatuh tempo</p>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-slate-100 p-1 rounded-lg self-start sm:self-center">
          <button onClick={() => setStatusFilter('all')} className={tabBtn(statusFilter === 'all')}>Semua</button>
          <button onClick={() => setStatusFilter('unpaid')} className={tabBtn(statusFilter === 'unpaid')}>Belum Bayar</button>
          <button onClick={() => setStatusFilter('partial')} className={tabBtn(statusFilter === 'partial')}>Dicicil</button>
          <button onClick={() => setStatusFilter('paid')} className={tabBtn(statusFilter === 'paid')}>Lunas</button>
        </div>
      </div>

      <Card>
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchDebts} />
        ) : (
          <DataTable
            columns={columns}
            data={debts}
            searchKey={(row) => row.customer?.name}
            searchPlaceholder="Cari pelanggan..."
          />
        )}
      </Card>
    </div>
  );
}