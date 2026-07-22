'use client';

import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatCurrency } from '@/lib/utils';

function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-white border border-slate-100 shadow-lg px-3.5 py-2.5">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
      <div className="flex items-center gap-1.5 mt-1">
        <span className="w-2 h-2 rounded-full bg-primary-600"></span>
        <span className="text-sm font-bold text-slate-800 tabular-nums">{formatCurrency(payload[0].value)}</span>
      </div>
    </div>
  );
}

export default function ReportChart({ data = [] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-72 w-full bg-slate-50 animate-pulse rounded-lg"></div>;

  const chartData = data.map((item) => ({
    name: item.name,
    Revenue: Number(item.total_revenue) || 0
  }));

  return (
    <div className="h-72 w-full">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} dy={8} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `Rp ${val / 1000}k`} />
            <Tooltip content={<RevenueTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="Revenue" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-slate-400 text-sm">
          Tidak ada data penjualan barang
        </div>
      )}
    </div>
  );
}