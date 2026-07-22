'use client';

import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, LabelList } from 'recharts';
import { formatCurrency } from '@/lib/utils';

function DebtTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-white border border-slate-100 shadow-lg px-3.5 py-2.5">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{payload[0].payload.name}</p>
      <div className="flex items-center gap-1.5 mt-1">
        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
        <span className="text-sm font-bold text-slate-800 tabular-nums">{formatCurrency(payload[0].value)}</span>
      </div>
    </div>
  );
}

const compactCurrency = (val) => {
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}jt`;
  if (val >= 1000) return `${Math.round(val / 1000)}rb`;
  return `${val}`;
};

export default function DebtChart({ data = [] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-72 w-full bg-slate-50 animate-pulse rounded-lg"></div>;

  const chartData = data.map((item) => ({
    name: item.name,
    Hutang: Number(item.active_debt) || 0
  }));

  const colors = ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fecdd3'];

  return (
    <div className="h-72 w-full">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 28, left: 10, bottom: 0 }} layout="vertical">
            <CartesianGrid strokeDasharray="0" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `Rp ${val / 1000}k`} />
            <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} width={80} />
            <Tooltip content={<DebtTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="Hutang" radius={[0, 4, 4, 0]} barSize={18}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
              <LabelList
                dataKey="Hutang"
                position="right"
                formatter={compactCurrency}
                className="fill-slate-500 text-[10px] font-semibold"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-slate-400 text-sm">
          Tidak ada data hutang aktif
        </div>
      )}
    </div>
  );
}