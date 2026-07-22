import React from 'react';
import { cn } from '@/lib/utils';

export default function Card({
  className,
  title,
  subtitle,
  children,
  footer
}) {
  return (
    <div className={cn('bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden', className)}>
      {(title || subtitle) && (
        <div className="px-5 py-4 border-b border-slate-100">
          {title && <h3 className="text-base font-bold text-slate-800">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100">{footer}</div>}
    </div>
  );
}