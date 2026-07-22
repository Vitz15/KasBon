'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useCartStore } from '@/stores/cartStore';
import ProductGrid from '@/components/sales/ProductGrid';
import Cart from '@/components/sales/Cart';
import CheckoutModal from '@/components/sales/CheckoutModal';
import Receipt from '@/components/sales/Receipt';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import Card from '@/components/ui/Card';
import Loading from '@/components/ui/Loading';
import ErrorState from '@/components/ui/ErrorState';
import { formatCurrency } from '@/lib/utils';
import { ShoppingCart, Trash2, CreditCard } from 'lucide-react';

export default function SalesPage() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Checkout & receipt states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);
  
  // Toast state
  const [toast, setToast] = useState(null);

  const {
    items,
    addItem,
    clearCart,
    getTotalAmount,
    getTotalQty,
    customer,
    paymentMethod,
    amountPaid,
    changeAmount,
    dueDate,
    notes
  } = useCartStore();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const prodRes = await api.get('/products');
      setProducts(prodRes.data);
      const custRes = await api.get('/customers');
      setCustomers(custRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat POS');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckout = async () => {
    setSubmitting(true);
    try {
      const payload = {
        customer_id: customer?.id || null,
        total_amount: getTotalAmount(),
        payment_method: paymentMethod,
        amount_paid: amountPaid,
        change_amount: Math.max(0, amountPaid - getTotalAmount()),
        notes: notes,
        due_date: paymentMethod === 'kasbon' ? dueDate : null,
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
          price: i.product.selling_price
        }))
      };

      const response = await api.post('/sales', payload);
      setCompletedSale(response.data);
      setToast({ type: 'success', message: 'Transaksi berhasil diselesaikan' });
      clearCart();
      setIsCheckoutOpen(false);
      // Refresh products stock
      const prodRes = await api.get('/products');
      setProducts(prodRes.data);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Transaksi gagal diproses' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewTransaction = () => {
    setCompletedSale(null);
  };

  const handleCreateCustomer = async (payload) => {
    const response = await api.post('/customers', payload);
    setCustomers((prev) => [...prev, response.data]);
    return response.data;
  };

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  if (completedSale) {
    return (
      <div className="py-6">
        <Receipt sale={completedSale} onNewTransaction={handleNewTransaction} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-[calc(100vh-120px)]">
      {/* Left Column: Product Selection Grid */}
      <div className="lg:col-span-2 flex flex-col h-full overflow-hidden">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">Mesin Kasir Warung</h2>
          <p className="text-xs text-slate-500 mt-0.5">Pilih barang di bawah untuk ditambahkan ke keranjang belanja</p>
        </div>
        <div className="flex-1 overflow-y-auto pr-1">
          <ProductGrid products={products} onAddItem={addItem} />
        </div>
      </div>

      {/* Right Column: Cart Panel */}
      <div className="lg:col-span-1 flex flex-col h-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-[17px] w-[17px] text-primary-600" />
            <h3 className="text-[13.5px] font-semibold text-slate-800">Keranjang Belanja</h3>
          </div>
          <span className="bg-primary-600 text-white px-2 py-0.5 rounded-full text-[11px] font-semibold tabular-nums">
            {getTotalQty()} barang
          </span>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto px-4">
          {items.length > 0 ? (
            <Cart />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
              <ShoppingCart className="h-7 w-7 text-slate-300" />
              <p className="text-xs font-medium">Keranjang masih kosong</p>
            </div>
          )}
        </div>

        {/* Summary Footer */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-100 space-y-3.5">
          <div className="flex justify-between items-center">
            <span className="text-[13px] font-medium text-slate-500">Total Tagihan</span>
            <span className="text-xl text-primary-700 font-extrabold tabular-nums">{formatCurrency(getTotalAmount())}</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Button
              type="button"
              variant="secondary"
              onClick={clearCart}
              disabled={items.length === 0}
              className="flex items-center justify-center space-x-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" /> <span>Kosongkan</span>
            </Button>
            <Button
              type="button"
              onClick={() => setIsCheckoutOpen(true)}
              disabled={items.length === 0}
              className="flex items-center justify-center space-x-1.5"
            >
              <CreditCard className="h-3.5 w-3.5" /> <span>Bayar</span>
            </Button>
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmit={handleCheckout}
        loading={submitting}
        customers={customers}
        onCreateCustomer={handleCreateCustomer}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}