'use client';

import React from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Eye, Receipt } from 'lucide-react';

export default function RecentTransactions({ transactions }) {
  return (
    <div className="overflow-x-auto -mx-5 -mb-5">
      <table className="min-w-full divide-y divide-slate-100 bg-white">
        <thead>
          <tr className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider text-left bg-slate-50/60">
            <th className="py-3 px-5">Pelanggan</th>
            <th className="py-3 px-4">Total</th>
            <th className="py-3 px-4">Metode</th>
            <th className="py-3 px-4">Tanggal</th>
            <th className="py-3 px-5 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
          {transactions && transactions.length > 0 ? (
            transactions.map((tx) => (
              <tr key={tx.id} className="group hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {(tx.customer?.name || 'U')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate">{tx.customer?.name || 'Umum / Tunai'}</p>
                      <p className="text-[11px] text-slate-400">{tx.invoice_number}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-semibold tabular-nums">{formatCurrency(tx.total_amount)}</td>
                <td className="py-3.5 px-4">
                  <Badge variant={tx.payment_method === 'cash' ? 'success' : 'warning'}>
                    {tx.payment_method === 'cash' ? 'Tunai' : 'KasBon'}
                  </Badge>
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-500">{formatDate(tx.created_at)}</td>
                <td className="py-3.5 px-5 text-right">
                  <Link
                    href={`/sales?id=${tx.id}`}
                    className="inline-flex items-center text-xs font-semibold text-primary-600 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" /> Detail
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-10 text-center">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Receipt className="h-8 w-8 text-slate-300" />
                  <span className="text-sm">Belum ada transaksi terbaru</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}