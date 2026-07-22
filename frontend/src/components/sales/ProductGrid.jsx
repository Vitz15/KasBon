'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Plus, Search, PackageSearch } from 'lucide-react';

export default function ProductGrid({ products = [], onAddItem }) {
  const [query, setQuery] = useState('');

  const filteredProducts = query
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.code?.toLowerCase().includes(query.toLowerCase())
      )
    : products;

  return (
    <div>
      <div className="mb-4 relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama atau kode barang..."
          className="w-full text-[13px] border border-slate-200 rounded-lg py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 bg-white placeholder:text-slate-400 transition-shadow"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 text-slate-400 py-16">
          <PackageSearch className="h-8 w-8 text-slate-300" />
          <span className="text-[13px] font-medium">Barang tidak ditemukan</span>
        </div>
      ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
      {filteredProducts.map((product) => {
        const isLow = product.stock <= product.min_stock;
        const isOutOfStock = product.stock === 0;

        return (
          <div
            key={product.id}
            onClick={() => !isOutOfStock && onAddItem(product)}
            className={`group relative bg-white border rounded-xl p-3.5 text-left flex flex-col justify-between h-[148px] transition-all duration-150 select-none ${
              isOutOfStock
                ? 'opacity-60 grayscale-[0.4] cursor-not-allowed border-slate-200'
                : 'cursor-pointer border-slate-200 hover:border-primary-300 hover:shadow-md hover:shadow-slate-200/60'
            }`}
          >
            {isOutOfStock && (
              <span className="absolute top-2.5 right-2.5 bg-slate-800 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
                Habis
              </span>
            )}
            {!isOutOfStock && isLow && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-amber-400"></span>
            )}
            {!isOutOfStock && (
              <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="h-3.5 w-3.5" />
              </div>
            )}

            <div>
              <h4 className="text-[13px] font-semibold text-slate-800 line-clamp-2 leading-snug pr-4">{product.name}</h4>
              <span className="text-[10px] text-slate-400 font-medium block mt-1">{product.code}</span>
            </div>

            <div>
              <p className="text-[15px] font-bold text-slate-900 tabular-nums">{formatCurrency(product.selling_price)}</p>
              <span className={`text-[10px] font-medium block mt-0.5 ${isLow ? 'text-amber-600' : 'text-slate-400'}`}>
                Stok {product.stock} {product.unit}
              </span>
            </div>
          </div>
        );
      })}
      </div>
      )}
    </div>
  );
}