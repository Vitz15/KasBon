'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import DataTable from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Toast from '@/components/ui/Toast';
import Badge from '@/components/ui/Badge';
import Loading from '@/components/ui/Loading';
import ErrorState from '@/components/ui/ErrorState';
import Card from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [currentCust, setCurrentCust] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [submitting, setSubmitting] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat daftar pelanggan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOpenModal = (cust = null) => {
    if (cust) {
      setCurrentCust(cust);
      setFormData({ name: cust.name, phone: cust.phone || '', address: cust.address || '' });
    } else {
      setCurrentCust(null);
      setFormData({ name: '', phone: '', address: '' });
    }
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setCurrentCust(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (currentCust) {
        // Update
        const response = await api.put(`/customers/${currentCust.id}`, formData);
        setCustomers(customers.map((c) => c.id === currentCust.id ? response.data : c));
        setToast({ type: 'success', message: 'Pelanggan berhasil diperbarui' });
      } else {
        // Create
        const response = await api.post('/customers', formData);
        setCustomers([...customers, response.data]);
        setToast({ type: 'success', message: 'Pelanggan berhasil ditambahkan' });
      }
      handleCloseModal();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Tindakan gagal dilakukan' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteTarget(id);
  };

  const handleConfirmDelete = async () => {
    const id = deleteTarget;
    setDeleting(true);
    try {
      await api.delete(`/customers/${id}`);
      setCustomers(customers.filter((c) => c.id !== id));
      setToast({ type: 'success', message: 'Pelanggan berhasil dihapus' });
      setDeleteTarget(null);
    } catch (err) {
      setToast({ type: 'error', message: 'Tidak dapat menghapus pelanggan yang masih memiliki hutang aktif' });
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const iconBtn = 'p-1.5 rounded-md hover:bg-slate-100 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400';

  const columns = [
    {
      header: 'Nama Pelanggan',
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-[11px] flex-shrink-0">
            {row.name?.[0]?.toUpperCase() || '?'}
          </div>
          <span className="font-semibold text-slate-800">{row.name}</span>
        </div>
      )
    },
    { header: 'No. Telepon', accessor: 'phone', cell: (row) => <span className="text-slate-500">{row.phone || '-'}</span> },
    { header: 'Alamat', accessor: 'address', cell: (row) => <span className="max-w-[200px] truncate block text-slate-500">{row.address || '-'}</span> },
    {
      header: 'Total Hutang Aktif',
      accessor: 'total_active_debt',
      cell: (row) => (
        <span className={`tabular-nums ${row.total_active_debt > 0 ? 'font-semibold text-rose-600' : 'text-slate-400 font-medium'}`}>
          {formatCurrency(row.total_active_debt)}
        </span>
      )
    },
    {
      header: 'Aksi',
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Link href={`/customers/${row.id}`} className={`${iconBtn} text-primary-600`} title="Detail Profil">
            <Eye className="h-4 w-4" />
          </Link>
          <button onClick={() => handleOpenModal(row)} className={`${iconBtn} text-slate-500`} title="Edit">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={() => handleDelete(row.id)} className={`${iconBtn} text-rose-500`} title="Hapus">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={fetchCustomers} />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Daftar Pelanggan Warung</h2>
          <p className="text-xs text-slate-500 mt-0.5">Kelola informasi pelanggan dan pantau buku kasbon masing-masing</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center space-x-1.5">
          <Plus className="h-4 w-4" /> <span>Tambah Pelanggan</span>
        </Button>
      </div>

      <Card>
        <DataTable
          columns={columns}
          data={customers}
          searchKey="name"
          searchPlaceholder="Cari pelanggan..."
        />
      </Card>

      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        title={currentCust ? 'Edit Informasi Pelanggan' : 'Tambah Pelanggan Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Contoh: Ibu Rina"
          />
          <Input
            label="No. Telepon / WhatsApp"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Contoh: 0852xxxxxxxx"
          />
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Alamat Lengkap</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="block w-full text-sm rounded-lg border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 bg-white"
              rows="3"
              placeholder="Alamat rumah pelanggan..."
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>Batal</Button>
            <Button type="submit" loading={submitting}>Simpan</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        message="Apakah Anda yakin ingin menghapus pelanggan ini? Tindakan ini tidak dapat dibatalkan."
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