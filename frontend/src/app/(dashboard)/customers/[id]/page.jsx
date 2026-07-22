'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Loading from '@/components/ui/Loading';
import ErrorState from '@/components/ui/ErrorState';
import Card from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowLeft, MessageSquare, Phone, MapPin, Receipt, ArrowRight } from 'lucide-react';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [customer, setCustomer] = useState(null);
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomerData = async () => {
    setLoading(true);
    setError(null);
    try {
      const custRes = await api.get(`/customers/${id}`);
      setCustomer(custRes.data);
      const debtsRes = await api.get(`/customers/${id}/debts`);
      setDebts(debtsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat profil pelanggan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCustomerData();
    }
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={fetchCustomerData} />;

  const activeDebtTotal = debts.reduce((sum, d) => d.status !== 'paid' ? sum + Number(d.remaining) : sum, 0);

  // Generate WhatsApp reminder link
  const getWhatsAppLink = () => {
    if (!customer?.phone) return '#';
    let cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1);
    }
    const message = `Halo ${customer.name}, sekadar mengingatkan dari Warung kami mengenai catatan KasBon Anda yang masih aktif dengan sisa sebesar *${formatCurrency(activeDebtTotal)}*. Pembayaran dapat dilakukan langsung di Warung. Terima kasih banyak atas kerja samanya. 😊`;
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-5">
      <div>
        <button
          onClick={() => router.push('/customers')}
          className="flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors mb-3 -ml-1 px-1 py-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Kembali ke Daftar Pelanggan
        </button>
        <h2 className="text-lg font-bold text-slate-900">Profil Pelanggan</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Side: Profile Info Card */}
        <div className="lg:col-span-1 space-y-5">
          <Card>
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center font-bold text-xl mx-auto mb-3">
                {customer?.name?.[0]?.toUpperCase() || 'P'}
              </div>
              <h3 className="text-base font-bold text-slate-900">{customer?.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Pelanggan Terdaftar</p>
            </div>

            <div className="py-4 space-y-3 text-[13px] text-slate-600 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <span>{customer?.phone || 'Tidak ada nomor telepon'}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{customer?.address || 'Tidak ada alamat terdaftar'}</span>
              </div>
            </div>

            <div className="pt-4 text-center">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Hutang Aktif Saat Ini</p>
              <h4 className="text-xl font-extrabold text-rose-600 mt-1.5 tabular-nums">{formatCurrency(activeDebtTotal)}</h4>

              {customer?.phone && activeDebtTotal > 0 && (
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 text-[13px] font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <MessageSquare className="h-4 w-4 mr-2" /> Kirim Pengingat WA
                </a>
              )}
            </div>
          </Card>
        </div>

        {/* Right Side: Debt List Card */}
        <div className="lg:col-span-2">
          <Card title="Riwayat KasBon & Piutang">
            <div className="space-y-3">
              {debts.length > 0 ? (
                debts.map((debt) => (
                  <div
                    key={debt.id}
                    className="p-3.5 border border-slate-200 rounded-lg hover:border-primary-200 hover:bg-slate-50/50 transition-colors duration-150 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-slate-800">
                          {debt.description || `KasBon #${debt.id}`}
                        </span>
                        <Badge variant={
                          debt.status === 'paid' ? 'success' :
                          debt.status === 'partial' ? 'warning' : 'danger'
                        }>
                          {debt.status === 'paid' ? 'Lunas' :
                           debt.status === 'partial' ? 'Dicicil' : 'Belum Bayar'}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Tanggal: {formatDate(debt.created_at)}
                        {debt.due_date && ` | Jatuh Tempo: ${formatDate(debt.due_date)}`}
                      </p>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-5">
                      <div className="text-right">
                        <p className="text-[11px] text-slate-400">Sisa Hutang</p>
                        <p className={`text-[13px] font-semibold tabular-nums ${debt.status === 'paid' ? 'text-slate-400 line-through' : 'text-rose-600'}`}>
                          {formatCurrency(debt.remaining)}
                        </p>
                      </div>
                      <Link
                        href={`/debts/${debt.id}`}
                        className="inline-flex items-center justify-center p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-primary-600 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400 text-sm">
                  Belum ada catatan kasbon untuk pelanggan ini
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}