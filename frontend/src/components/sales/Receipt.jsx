'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Printer, RefreshCw } from 'lucide-react';

export default function Receipt({ sale, onNewTransaction }) {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const total = Number(sale.total_amount);
  const paid = Number(sale.amount_paid);
  const change = Number(sale.change_amount);
  const remaining = total - paid;

  return (
    <div className="max-w-sm mx-auto bg-white p-6 rounded-xl border border-slate-200 shadow-md text-center space-y-6 print:border-none print:shadow-none print:p-0">
      <div className="space-y-1">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-wide uppercase">Warung Subur</h3>
        <p className="text-[10px] text-slate-400 font-medium">Jl. Sederhana No.15, RT 02 RW 02, Jakarta</p>
        <p className="text-[10px] text-slate-400 font-medium">Telp: 0852-1234-5678</p>
      </div>

      <div className="border-y border-dashed border-slate-200 py-3 text-left space-y-1 text-xs text-slate-500">
        <div className="flex justify-between">
          <span>No. Invoice:</span>
          <span className="font-bold text-slate-800">{sale.invoice_number}</span>
        </div>
        <div className="flex justify-between">
          <span>Tanggal:</span>
          <span>{formatDate(sale.created_at)}</span>
        </div>
        <div className="flex justify-between">
          <span>Kasir:</span>
          <span>{sale.user?.name || 'Kasir'}</span>
        </div>
        <div className="flex justify-between">
          <span>Pelanggan:</span>
          <span>{sale.customer?.name || 'Umum / Tunai'}</span>
        </div>
      </div>

      {/* Sale Items */}
      <div className="space-y-3 text-left">
        {sale.items && sale.items.map((item) => (
          <div key={item.id} className="text-xs">
            <div className="flex justify-between font-semibold text-slate-800">
              <span>{item.product?.name}</span>
              <span className="tabular-nums">{formatCurrency(item.subtotal)}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {item.quantity} {item.product?.unit} x {formatCurrency(item.price)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-slate-200 pt-3 text-left space-y-1.5 text-xs">
        <div className="flex justify-between font-bold text-slate-800">
          <span>Total Tagihan:</span>
          <span className="tabular-nums">{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Metode Pembayaran:</span>
          <span className="capitalize">{sale.payment_method === 'cash' ? 'Tunai' : 'KasBon'}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Jumlah Dibayar:</span>
          <span className="tabular-nums">{formatCurrency(paid)}</span>
        </div>
        {sale.payment_method === 'cash' ? (
          <div className="flex justify-between font-bold text-emerald-600">
            <span>Kembalian:</span>
            <span className="tabular-nums">{formatCurrency(change)}</span>
          </div>
        ) : (
          <div className="flex justify-between font-bold text-rose-600 border-t border-dashed border-slate-100 pt-1.5">
            <span>Hutang KasBon:</span>
            <span className="tabular-nums">{formatCurrency(remaining)}</span>
          </div>
        )}
      </div>

      <div className="text-[10px] text-slate-400 font-medium italic pt-4">
        Terima kasih atas kunjungan Anda!
      </div>

      <div className="flex justify-center space-x-3 pt-6 print:hidden">
        <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center space-x-1">
          <Printer className="h-4 w-4" /> <span>Cetak</span>
        </Button>
        <Button size="sm" onClick={onNewTransaction} className="flex items-center space-x-1">
          <RefreshCw className="h-4 w-4" /> <span>Transaksi Baru</span>
        </Button>
      </div>
    </div>
  );
}