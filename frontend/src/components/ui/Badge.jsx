import React from 'react';
import { cn } from '@/lib/utils';

export default function Badge({
  variant = 'default',
  children,
  className
}) {
  const styles = {
    default: 'bg-slate-100 text-slate-800',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
  };

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', styles[variant], className)}>
      {children}
    </span>
  );
}