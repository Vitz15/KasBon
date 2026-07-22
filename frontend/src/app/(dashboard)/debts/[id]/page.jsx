'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';
import Loading from '@/components/ui/Loading';
import ErrorState from '@/components/ui/ErrorState';
import Card from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowLeft, Plus, Calendar, DollarSign, User } from 'lucide-react';

export default function DebtDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [debt, setDebt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pay modal states
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState(null);

  const fetchDebtDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/debts/${id}`);
      setDebt(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat catatan KasBon');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDebtDetails();
    }
  }, [id]);

  const handleOpenModal = () => {
    setAmount(String(debt?.remaining || ''));
    setNote('');
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    const payAmount = Number(amount);
    if (!payAmount || payAmount <= 0) {
      setToast({ type: 'error', message: 'Jumlah bayar harus lebih dari 0' });
      return;
    }
    if (payAmount > Number(debt?.remaining)) {
      setToast({ type: 'error', message: 'Pembayaran melebihi sisa hutang aktif' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post(`/debts/${id}/pay`, {
        amount: payAmount,
        payment_method: 'cash',
        note: note
      });
      setDebt(response.data.debt);
      setToast({ type: 'success', message: 'Pembayaran berhasil direkam' });
      handleCloseModal();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Pembayaran gagal direkam' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={fetchDebtDetails} />;

  const isOverdue = debt?.status !== 'paid' && debt?.due_date && new Date(debt.due_date) < new Date();

  return (
    <div className="space-y-5">
      <div>
        <button
          onClick={() => router.push('/debts')}
          className="flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors mb-3 -ml-1 px-1 py-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Kembali ke Buku KasBon
        </button>
        <h2 className="text-lg font-bold text-slate-900">Detail Catatan KasBon</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Side: Summary and Actions */}
        <div className="lg:col-span-1 space-y-5">
          <Card>
            <div className="text-center pb-4 border-b border-slate-100">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Status Piutang</span>
              <div className="mt-2">
                <Badge variant={
                  debt?.status === 'paid' ? 'success' :
                  isOverdue ? 'danger' :
                  debt?.status === 'partial' ? 'warning' : 'danger'
                }>
                  {debt?.status === 'paid' ? 'Lunas' :
                   isOverdue ? 'Jatuh Tempo' :
                   debt?.status === 'partial' ? 'Dicicil' : 'Belum Lunas'}
                </Badge>
              </div>
            </div>

            <div className="py-4 space-y-3.5 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">Nama Pelanggan</p>
                <p className="text-[13px] font-semibold text-slate-800">{debt?.customer?.name}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">Total KasBon Awal</p>
                <p className="text-[13px] font-semibold text-slate-700 tabular-nums">{formatCurrency(debt?.amount)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">Batas Waktu</p>
                <p className={`text-[13px] font-semibold tabular-nums ${isOverdue ? 'text-rose-600' : 'text-slate-600'}`}>
                  {formatDate(debt?.due_date)}
                </p>
              </div>
              <div className="pt-1 flex items-center justify-between">
                <p className="text-xs text-slate-400">Sisa KasBon Aktif</p>
                <p className={`text-xl font-extrabold tabular-nums ${debt?.status === 'paid' ? 'text-slate-400' : 'text-rose-600'}`}>
                  {formatCurrency(debt?.remaining)}
                </p>
              </div>
            </div>

            {debt?.status !== 'paid' && (
              <div className="pt-4">
                <Button onClick={handleOpenModal} className="w-full flex items-center justify-center space-x-1.5">
                  <Plus className="h-4 w-4" /> <span>Bayar Cicilan / Lunas</span>
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Right Side: Payment logs */}
        <div className="lg:col-span-2">
          <Card title="Riwayat Cicilan & Pembayaran">
            <div className="divide-y divide-slate-100">
              {debt?.payments && debt.payments.length > 0 ? (
                debt.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13.5px] font-bold text-slate-800 tabular-nums">
                          {formatCurrency(payment.amount)}
                        </span>
                        <Badge variant="success">Sukses</Badge>
                      </div>
                      {payment.note && <p className="text-xs text-slate-500">{payment.note}</p>}
                      <p className="text-[11px] text-slate-400">
                        Dicatat oleh: {payment.user?.name}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] text-slate-400">Tanggal Bayar</p>
                      <p className="text-xs font-semibold text-slate-600 mt-0.5">
                        {formatDate(payment.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400 text-sm">
                  Belum ada cicilan yang dibayarkan untuk KasBon ini
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        title="Catat Pembayaran KasBon"
      >
        <form onSubmit={handleSubmitPayment} className="space-y-4">
          <Input
            label="Jumlah Pembayaran (Rupiah)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder="Masukkan nominal bayar..."
            max={debt?.remaining}
            min={1}
          />
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Catatan Pembayaran</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="block w-full text-sm rounded-lg border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 bg-white"
              rows="3"
              placeholder="Catatan tambahan (misal: 'Dicicil oleh suaminya')"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>Batal</Button>
            <Button type="submit" loading={submitting}>Simpan Pembayaran</Button>
          </div>
        </form>
      </Modal>

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