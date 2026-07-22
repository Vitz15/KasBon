import React from 'react';
import Button from './Button';

export default function ErrorState({
  message = 'Terjadi kesalahan saat memuat data.',
  onRetry
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-rose-50/30 rounded-xl border border-rose-100 max-w-sm mx-auto my-6">
      <div className="p-3 bg-rose-50 rounded-full mb-4 text-rose-500 border border-rose-100">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-sm font-bold text-rose-700">Error terjadi</h3>
      <p className="text-xs text-rose-600 mt-1 mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry}>
          Coba Lagi
        </Button>
      )}
    </div>
  );
}