import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react';

export default function Toast({
  message,
  type = 'success',
  onClose,
  duration = 3000
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: { border: 'border-l-emerald-500', icon: 'text-emerald-600', Icon: CheckCircle2 },
    error: { border: 'border-l-rose-500', icon: 'text-rose-600', Icon: XCircle },
    warning: { border: 'border-l-amber-500', icon: 'text-amber-600', Icon: AlertTriangle },
  };
  const s = styles[type] || styles.success;
  const Icon = s.Icon;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className={`flex items-start gap-2.5 bg-white border border-slate-200 border-l-4 ${s.border} rounded-lg shadow-lg px-4 py-3 max-w-sm`}>
        <Icon className={`h-[18px] w-[18px] flex-shrink-0 mt-0.5 ${s.icon}`} />
        <span className="text-[13px] font-medium text-slate-700 leading-snug">{message}</span>
        <button onClick={onClose} className="ml-1 flex-shrink-0 text-slate-300 hover:text-slate-500 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
