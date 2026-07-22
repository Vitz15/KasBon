import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center p-10 space-y-4">
      <div className="relative w-10 h-10">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-600 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <p className="text-sm font-medium text-slate-500 animate-pulse">Memuat data...</p>
    </div>
  );
}