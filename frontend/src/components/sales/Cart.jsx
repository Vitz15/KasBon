'use client';

import React from 'react';
import { useCartStore } from '@/stores/cartStore';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { Minus, Plus, Trash2 } from 'lucide-react';

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotalAmount } = useCartStore();

  return (
    <div className="divide-y divide-slate-100">
      {items.map((item) => (
        <div key={item.product.id} className="flex items-center justify-between py-3 first:pt-0">
          <div className="flex-1 min-w-0 pr-3">
            <h4 className="text-[13px] font-semibold text-slate-800 truncate">{item.product.name}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {formatCurrency(item.product.selling_price)} / {item.product.unit}
            </p>
          </div>

          <div className="flex items-center space-x-2.5 flex-shrink-0">
            {/* Quantity controls */}
            <div className="flex items-center border border-slate-200 rounded-md bg-slate-50">
              <button
                type="button"
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="px-2 text-xs font-semibold text-slate-800 tabular-nums min-w-[20px] text-center">{item.quantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-40 disabled:hover:text-slate-500"
                disabled={item.quantity >= item.product.stock}
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            <span className="text-[13px] font-bold text-slate-800 tabular-nums min-w-[64px] text-right">
              {formatCurrency(item.quantity * item.product.selling_price)}
            </span>

            <button
              type="button"
              onClick={() => removeItem(item.product.id)}
              className="p-1 text-slate-300 hover:text-rose-600 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}