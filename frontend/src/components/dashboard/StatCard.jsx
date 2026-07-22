'use client';

import React from 'react';
import Card from '@/components/ui/Card';

export default function StatCard({ title, value, icon, description, color = 'primary' }) {
  const colorMap = {
    primary: {
      chip: 'from-primary-500 to-primary-600 shadow-primary-500/25',
      glow: 'bg-primary-400',
    },
    success: {
      chip: 'from-emerald-500 to-emerald-600 shadow-emerald-500/25',
      glow: 'bg-emerald-400',
    },
    warning: {
      chip: 'from-amber-500 to-amber-600 shadow-amber-500/25',
      glow: 'bg-amber-400',
    },
    danger: {
      chip: 'from-rose-500 to-rose-600 shadow-rose-500/25',
      glow: 'bg-rose-400',
    },
  };
  const c = colorMap[color];

  return (
    <Card className="relative overflow-hidden hover-card-trigger">
      <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full ${c.glow} opacity-[0.08] blur-2xl pointer-events-none`}></div>
      <div className="relative flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">{title}</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1.5 tabular-nums">{value}</h3>
          {description && <p className="text-xs text-slate-400 mt-1.5">{description}</p>}
        </div>
        <div className={`flex-shrink-0 p-3 rounded-2xl bg-gradient-to-br ${c.chip} text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}