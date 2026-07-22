'use client';

import React, { useState } from 'react';
import { useCartStore } from '@/stores/cartStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/utils';
import { Calendar, CreditCard, DollarSign, UserPlus, X } from 'lucide-react';

export default function CheckoutModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
  customers = [],
  onCreateCustomer
}) {
  const {
    customer,
    setCustomer,
    paymentMethod,
    setPaymentMethod,
    amountPaid,
    setAmountPaid,
    dueDate,
    setDueDate,
    notes,
    setNotes,
    getTotalAmount
  } = useCartStore();

  const total = getTotalAmount();
  const change = Math.max(0, amountPaid - total);
  const remainingDebt = Math.max(0, total - amountPaid);

  // Inline "add new customer" form state
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({ name: '', phone: '' });
  const [creatingCustomer, setCreatingCustomer] = useState(false);
  const [newCustomerError, setNewCustomerError] = useState('');

  const handleOpenNewCustomer = () => {
    setNewCustomerForm({ name: '', phone: '' });
    setNewCustomerError('');
    setShowNewCustomer(true);
  };

  const handleCreateNewCustomer = async () => {
    if (!newCustomerForm.name.trim()) {
      setNewCustomerError('Nama pelanggan wajib diisi');
      return;
    }
    setCreatingCustomer(true);
    setNewCustomerError('');
    try {
      const created = await onCreateCustomer({ name: newCustomerForm.name.trim(), phone: newCustomerForm.phone.trim() });
      setCustomer(created);
      setShowNewCustomer(false);
    } catch (err) {
      setNewCustomerError(err.response?.data?.message || 'Gagal menambahkan pelanggan baru');
    } finally {
      setCreatingCustomer(false);
    }
  };

  const handleMethodChange = (method) => {
    setPaymentMethod(method);
    if (method === 'cash') {
      setAmountPaid(total);
      setCustomer(null);
    } else {
      setAmountPaid(0);
      setDueDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 7 days from now
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'kasbon' && !customer) {
      alert('Pelanggan wajib dipilih jika menggunakan metode KasBon');
      return;
    }
    onSubmit();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Penyelesaian Transaksi (Checkout)" size="md">
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Payment Methods toggle */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-2">Metode Pembayaran</label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleMethodChange('cash')}
              className={`p-2.5 border rounded-lg flex items-center justify-center gap-2 font-semibold text-[13px] transition-colors duration-150 ${
                paymentMethod === 'cash'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="h-4 w-4" />
              <span>Tunai</span>
            </button>
            <button
              type="button"
              onClick={() => handleMethodChange('kasbon')}
              className={`p-2.5 border rounded-lg flex items-center justify-center gap-2 font-semibold text-[13px] transition-colors duration-150 ${
                paymentMethod === 'kasbon'
                  ? 'border-rose-400 bg-rose-50 text-rose-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <DollarSign className="h-4 w-4" />
              <span>KasBon</span>
            </button>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
          <div className="flex justify-between text-[13px] text-slate-500 font-medium">
            <span>Total Transaksi</span>
            <span className="text-slate-800 font-semibold tabular-nums">{formatCurrency(total)}</span>
          </div>
          {paymentMethod === 'cash' ? (
            <div className="flex justify-between text-[13px] text-slate-500 font-medium">
              <span>Kembalian</span>
              <span className="text-emerald-600 font-semibold tabular-nums">{formatCurrency(change)}</span>
            </div>
          ) : (
            <div className="flex justify-between text-[13px] text-slate-500 font-medium">
              <span>Sisa Hutang KasBon</span>
              <span className="text-rose-600 font-semibold tabular-nums">{formatCurrency(remainingDebt)}</span>
            </div>
          )}
        </div>

        {/* Dynamic Fields based on Payment Method */}
        {paymentMethod === 'cash' ? (
          <Input
            label="Jumlah Uang Tunai Diterima"
            type="number"
            value={amountPaid || ''}
            onChange={(e) => setAmountPaid(Number(e.target.value))}
            required
            placeholder="Masukkan jumlah tunai..."
            min={total}
          />
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-500">Pilih Pelanggan KasBon</label>
                {!showNewCustomer && onCreateCustomer && (
                  <button
                    type="button"
                    onClick={handleOpenNewCustomer}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-600 hover:text-primary-700"
                  >
                    <UserPlus className="h-3 w-3" /> Pelanggan Baru
                  </button>
                )}
              </div>

              {showNewCustomer ? (
                <div className="rounded-lg border border-primary-200 bg-primary-50/40 p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-primary-700">Tambah Pelanggan Baru</span>
                    <button
                      type="button"
                      onClick={() => setShowNewCustomer(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newCustomerForm.name}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                    placeholder="Nama pelanggan"
                    className="block w-full text-[13px] rounded-md border border-slate-300 py-1.5 px-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 bg-white"
                  />
                  <input
                    type="text"
                    value={newCustomerForm.phone}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                    placeholder="No. telepon (opsional)"
                    className="block w-full text-[13px] rounded-md border border-slate-300 py-1.5 px-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 bg-white"
                  />
                  {newCustomerError && <p className="text-[11px] text-rose-500">{newCustomerError}</p>}
                  <div className="flex justify-end gap-2 pt-0.5">
                    <Button type="button" variant="secondary" size="sm" onClick={() => setShowNewCustomer(false)}>
                      Batal
                    </Button>
                    <Button type="button" size="sm" loading={creatingCustomer} onClick={handleCreateNewCustomer}>
                      Simpan & Pilih
                    </Button>
                  </div>
                </div>
              ) : (
                <select
                  value={customer?.id || ''}
                  onChange={(e) => {
                    const cust = customers.find((c) => c.id === Number(e.target.value));
                    setCustomer(cust || null);
                  }}
                  required
                  className="block w-full text-sm rounded-lg border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 bg-white"
                >
                  <option value="">Pilih Pelanggan</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Hutang: {formatCurrency(c.total_active_debt)})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Bayar Muka (DP) - Opsional"
                type="number"
                value={amountPaid || ''}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
                placeholder="Jumlah DP..."
                max={total - 1}
              />
              <Input
                label="Batas Jatuh Tempo"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                icon={<Calendar className="h-4 w-4" />}
              />
            </div>
          </div>
        )}

        <Input
          label="Catatan Tambahan (Opsional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Tambahkan catatan kecil transaksi..."
        />

        <div className="flex justify-end space-x-3 mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>Kembali</Button>
          <Button type="submit" loading={loading} className={paymentMethod === 'kasbon' ? 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500' : ''}>
            Proses & Cetak Struk
          </Button>
        </div>
      </form>
    </Modal>
  );
}