'use client';

import React, { useEffect, useState } from 'react';
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
import { Plus, Edit, Trash2, ArrowUpCircle, Folder, Truck, Package } from 'lucide-react';

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'categories', 'suppliers'
  
  // Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSupplierOpen, setIsSupplierOpen] = useState(false);
  
  // Product Form State
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    code: '', name: '', purchase_price: '', selling_price: '', stock: '', min_stock: '', unit: 'pcs', category_id: '', supplier_id: '', description: ''
  });
  
  // Stock Form State
  const [stockForm, setStockForm] = useState({ product_id: '', quantity: '', type: 'in', note: '', reference: 'Restock Manual' });

  // Category Form State
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });

  // Supplier Form State
  const [supplierForm, setSupplierForm] = useState({ name: '', phone: '', address: '' });

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Delete confirmation state
  const [confirmState, setConfirmState] = useState(null); // { message, onConfirm }
  const [deleting, setDeleting] = useState(false);

  const handleConfirmedDelete = async () => {
    if (!confirmState) return;
    setDeleting(true);
    await confirmState.onConfirm();
    setDeleting(false);
    setConfirmState(null);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const prodRes = await api.get('/products');
      setProducts(prodRes.data);
      const catRes = await api.get('/categories');
      setCategories(catRes.data);
      const supRes = await api.get('/suppliers');
      setSuppliers(supRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data inventaris');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // PRODUCT HANDLERS
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setProductForm({
        code: product.code,
        name: product.name,
        purchase_price: product.purchase_price,
        selling_price: product.selling_price,
        stock: product.stock,
        min_stock: product.min_stock,
        unit: product.unit,
        category_id: product.category_id || '',
        supplier_id: product.supplier_id || '',
        description: product.description || ''
      });
    } else {
      setCurrentProduct(null);
      setProductForm({
        code: '', name: '', purchase_price: '', selling_price: '', stock: '0', min_stock: '5', unit: 'pcs', category_id: '', supplier_id: '', description: ''
      });
    }
    setIsProductOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (currentProduct) {
        const response = await api.put(`/products/${currentProduct.id}`, productForm);
        setProducts(products.map((p) => p.id === currentProduct.id ? response.data : p));
        setToast({ type: 'success', message: 'Produk berhasil diperbarui' });
      } else {
        const response = await api.post('/products', productForm);
        setProducts([...products, response.data]);
        setToast({ type: 'success', message: 'Produk baru berhasil ditambahkan' });
      }
      setIsProductOpen(false);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Tindakan gagal' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = (id) => {
    setConfirmState({
      message: 'Yakin ingin menghapus produk ini secara permanen? Tindakan ini tidak dapat dibatalkan.',
      onConfirm: async () => {
        try {
          await api.delete(`/products/${id}`);
          setProducts(products.filter((p) => p.id !== id));
          setToast({ type: 'success', message: 'Produk berhasil dihapus' });
        } catch (err) {
          setToast({ type: 'error', message: err.response?.data?.message || 'Gagal menghapus produk' });
        }
      }
    });
  };

  // STOCK HANDLERS
  const handleOpenStockModal = (product) => {
    setStockForm({
      product_id: product.id,
      quantity: '',
      type: 'in',
      note: '',
      reference: 'Restock Manual'
    });
    setCurrentProduct(product);
    setIsStockOpen(true);
  };

  const handleStockSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post('/stock-movements', stockForm);
      setProducts(products.map((p) => p.id === currentProduct.id ? { ...p, stock: response.data.product.stock } : p));
      setToast({ type: 'success', message: 'Stok barang berhasil disesuaikan' });
      setIsStockOpen(false);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Gagal menyesuaikan stok' });
    } finally {
      setSubmitting(false);
    }
  };

  // CATEGORY HANDLERS
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post('/categories', categoryForm);
      setCategories([...categories, response.data]);
      setToast({ type: 'success', message: 'Kategori baru berhasil ditambahkan' });
      setCategoryForm({ name: '', description: '' });
      setIsCategoryOpen(false);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Gagal menambahkan kategori' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = (id) => {
    setConfirmState({
      message: 'Yakin ingin menghapus kategori ini?',
      onConfirm: async () => {
        try {
          await api.delete(`/categories/${id}`);
          setCategories(categories.filter((c) => c.id !== id));
          setToast({ type: 'success', message: 'Kategori berhasil dihapus' });
        } catch (err) {
          setToast({ type: 'error', message: 'Tidak dapat menghapus kategori yang masih digunakan oleh produk' });
        }
      }
    });
  };

  // SUPPLIER HANDLERS
  const [returnToProduct, setReturnToProduct] = useState(false);

  const handleSupplierSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post('/suppliers', supplierForm);
      const newSupplier = response.data;
      setSuppliers([...suppliers, newSupplier]);
      setToast({ type: 'success', message: 'Supplier baru berhasil ditambahkan' });
      setSupplierForm({ name: '', phone: '', address: '' });
      setIsSupplierOpen(false);
      if (returnToProduct) {
        setProductForm((prev) => ({ ...prev, supplier_id: newSupplier.id }));
        setTimeout(() => setIsProductOpen(true), 100);
        setReturnToProduct(false);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Gagal menambahkan supplier' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSupplier = (id) => {
    setConfirmState({
      message: 'Yakin ingin menghapus supplier ini?',
      onConfirm: async () => {
        try {
          await api.delete(`/suppliers/${id}`);
          setSuppliers(suppliers.filter((s) => s.id !== id));
          setToast({ type: 'success', message: 'Supplier berhasil dihapus' });
        } catch (err) {
          setToast({ type: 'error', message: 'Tidak dapat menghapus supplier yang masih terikat dengan produk' });
        }
      }
    });
  };

  // COLUMNS DEFINITIONS
  const iconBtn = 'p-1.5 rounded-md hover:bg-slate-100 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400';

  const productColumns = [
    { header: 'SKU / Barcode', accessor: 'code', cell: (row) => <span className="font-medium text-[12px] text-slate-500">{row.code}</span> },
    { header: 'Nama Barang', accessor: 'name', cell: (row) => <span className="font-semibold text-slate-800">{row.name}</span> },
    { header: 'Kategori', cell: (row) => <span className="text-slate-500">{categories.find((c) => c.id === row.category_id)?.name || 'Umum'}</span> },
    { header: 'Harga Beli', cell: (row) => <span className="text-slate-500 tabular-nums">{formatCurrency(row.purchase_price)}</span> },
    { header: 'Harga Jual', cell: (row) => <span className="font-semibold text-slate-700 tabular-nums">{formatCurrency(row.selling_price)}</span> },
    {
      header: 'Stok',
      accessor: 'stock',
      cell: (row) => {
        const isLow = row.stock <= row.min_stock;
        return (
          <div className="flex items-center gap-2">
            <span className={`font-semibold tabular-nums ${isLow ? 'text-rose-600' : 'text-slate-700'}`}>
              {row.stock} {row.unit}
            </span>
            {isLow && (
              <Badge variant="danger" className="text-[9px] px-1.5 py-0">
                {row.stock === 0 ? 'Habis' : 'Menipis'}
              </Badge>
            )}
          </div>
        );
      }
    },
    {
      header: 'Aksi',
      cell: (row) => (
        <div className="flex items-center gap-1">
          <button onClick={() => handleOpenStockModal(row)} className={`${iconBtn} text-emerald-600`} title="Restock Manual">
            <ArrowUpCircle className="h-4 w-4" />
          </button>
          <button onClick={() => handleOpenProductModal(row)} className={`${iconBtn} text-slate-500`} title="Edit">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={() => handleDeleteProduct(row.id)} className={`${iconBtn} text-rose-500`} title="Hapus">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const categoryColumns = [
    { header: 'Nama Kategori', accessor: 'name', cell: (row) => <span className="font-semibold text-slate-800">{row.name}</span> },
    { header: 'Deskripsi', accessor: 'description', cell: (row) => <span className="text-slate-500">{row.description || '-'}</span> },
    {
      header: 'Aksi',
      cell: (row) => (
        <button onClick={() => handleDeleteCategory(row.id)} className={`${iconBtn} text-rose-500`} title="Hapus">
          <Trash2 className="h-4 w-4" />
        </button>
      )
    }
  ];

  const supplierColumns = [
    { header: 'Nama Supplier', accessor: 'name', cell: (row) => <span className="font-semibold text-slate-800">{row.name}</span> },
    { header: 'No. Telepon', accessor: 'phone', cell: (row) => <span className="text-slate-500">{row.phone || '-'}</span> },
    { header: 'Alamat', accessor: 'address', cell: (row) => <span className="text-slate-500">{row.address || '-'}</span> },
    {
      header: 'Aksi',
      cell: (row) => (
        <button onClick={() => handleDeleteSupplier(row.id)} className={`${iconBtn} text-rose-500`} title="Hapus">
          <Trash2 className="h-4 w-4" />
        </button>
      )
    }
  ];

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  const tabBtn = (isActive) =>
    `px-3 py-1.5 text-[12.5px] font-medium rounded-md flex items-center gap-1.5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
      isActive ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
    }`;

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Manajemen Inventaris</h2>
          <p className="text-xs text-slate-500 mt-0.5">Pantau stok barang, edit katalog, kelola kategori, serta daftar pemasok (supplier)</p>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-slate-100 p-1 rounded-lg self-start md:self-center">
          <button onClick={() => setActiveTab('products')} className={tabBtn(activeTab === 'products')}>
            <Package className="h-3.5 w-3.5" /> <span>Stok Barang</span>
          </button>
          <button onClick={() => setActiveTab('categories')} className={tabBtn(activeTab === 'categories')}>
            <Folder className="h-3.5 w-3.5" /> <span>Kategori</span>
          </button>
          <button onClick={() => setActiveTab('suppliers')} className={tabBtn(activeTab === 'suppliers')}>
            <Truck className="h-3.5 w-3.5" /> <span>Supplier</span>
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        {activeTab === 'products' && (
          <Button onClick={() => handleOpenProductModal()} className="flex items-center space-x-1.5">
            <Plus className="h-4 w-4" /> <span>Tambah Barang Baru</span>
          </Button>
        )}
        {activeTab === 'categories' && (
          <Button onClick={() => setIsCategoryOpen(true)} className="flex items-center space-x-1.5">
            <Plus className="h-4 w-4" /> <span>Tambah Kategori Baru</span>
          </Button>
        )}
        {activeTab === 'suppliers' && (
          <Button onClick={() => setIsSupplierOpen(true)} className="flex items-center space-x-1.5">
            <Plus className="h-4 w-4" /> <span>Tambah Supplier Baru</span>
          </Button>
        )}
      </div>

      <Card>
        {activeTab === 'products' && (
          <DataTable
            columns={productColumns}
            data={products}
            searchKey="name"
            searchPlaceholder="Cari nama barang..."
          />
        )}
        {activeTab === 'categories' && (
          <DataTable
            columns={categoryColumns}
            data={categories}
            searchKey="name"
            searchPlaceholder="Cari kategori..."
          />
        )}
        {activeTab === 'suppliers' && (
          <DataTable
            columns={supplierColumns}
            data={suppliers}
            searchKey="name"
            searchPlaceholder="Cari supplier..."
          />
        )}
      </Card>

      {/* Product Add/Edit Modal */}
      <Modal
        isOpen={isProductOpen}
        onClose={() => setIsProductOpen(false)}
        title={currentProduct ? 'Edit Informasi Barang' : 'Tambah Barang Baru'}
        size="lg"
      >
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Barcode / SKU"
              value={productForm.code}
              onChange={(e) => setProductForm({ ...productForm, code: e.target.value })}
              required
              placeholder="Contoh: 899xxxxxxxx"
            />
            <Input
              label="Nama Barang"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              required
              placeholder="Contoh: Indomie Goreng"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Harga Beli (Modal)"
              type="number"
              value={productForm.purchase_price}
              onChange={(e) => setProductForm({ ...productForm, purchase_price: e.target.value })}
              required
            />
            <Input
              label="Harga Jual"
              type="number"
              value={productForm.selling_price}
              onChange={(e) => setProductForm({ ...productForm, selling_price: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Stok Awal"
              type="number"
              value={productForm.stock}
              onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
              disabled={!!currentProduct}
              required
            />
            <Input
              label="Stok Minimum"
              type="number"
              value={productForm.min_stock}
              onChange={(e) => setProductForm({ ...productForm, min_stock: e.target.value })}
              required
            />
            <Input
              label="Satuan Barang"
              value={productForm.unit}
              onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
              required
              placeholder="pcs, bungkus, kg..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Kategori</label>
              <select
                value={productForm.category_id}
                onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                className="block w-full text-sm rounded-lg border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 bg-white"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Supplier</label>
              <div className="flex gap-2">
                <select
                  value={productForm.supplier_id}
                  onChange={(e) => setProductForm({ ...productForm, supplier_id: e.target.value })}
                  className="block w-full text-sm rounded-lg border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 bg-white"
                >
                  <option value="">Pilih Supplier</option>
                  {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <button
                  type="button"
                  onClick={() => { setReturnToProduct(true); setIsProductOpen(false); setTimeout(() => setIsSupplierOpen(true), 100); }}
                  className="flex-shrink-0 text-xs font-semibold text-primary-600 border border-primary-300 rounded-lg px-2 py-1 hover:bg-primary-50 whitespace-nowrap"
                  title="Tambah supplier baru"
                >
                  + Baru
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsProductOpen(false)}>Batal</Button>
            <Button type="submit" loading={submitting}>Simpan Produk</Button>
          </div>
        </form>
      </Modal>

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={isStockOpen}
        onClose={() => setIsStockOpen(false)}
        title={`Sesuaikan Stok: ${currentProduct?.name}`}
      >
        <form onSubmit={handleStockSubmit} className="space-y-4">
          <Input
            label="Jumlah Penambahan / Pengurangan"
            type="number"
            value={stockForm.quantity}
            onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
            required
            placeholder="Nominal jumlah qty..."
          />
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Jenis Penyesuaian</label>
            <select
              value={stockForm.type}
              onChange={(e) => setStockForm({ ...stockForm, type: e.target.value })}
              className="block w-full text-sm rounded-lg border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 bg-white"
            >
              <option value="in">Stok Masuk (Restock / Tambah)</option>
              <option value="out">Stok Keluar (Buang / Pecah / Hilang)</option>
            </select>
          </div>
          <Input
            label="Referensi / Sumber"
            value={stockForm.reference}
            onChange={(e) => setStockForm({ ...stockForm, reference: e.target.value })}
            placeholder="Restock supplier, Koreksi stok..."
          />
          <Input
            label="Catatan Tambahan"
            value={stockForm.note}
            onChange={(e) => setStockForm({ ...stockForm, note: e.target.value })}
            placeholder="Catatan kecil alasan..."
          />

          <div className="flex justify-end space-x-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsStockOpen(false)}>Batal</Button>
            <Button type="submit" loading={submitting}>Simpan Stok</Button>
          </div>
        </form>
      </Modal>

      {/* Category Modal */}
      <Modal
        isOpen={isCategoryOpen}
        onClose={() => setIsCategoryOpen(false)}
        title="Tambah Kategori Baru"
      >
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <Input
            label="Nama Kategori"
            value={categoryForm.name}
            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
            required
            placeholder="Contoh: Deterjen, Sembako..."
          />
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Deskripsi</label>
            <textarea
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              className="block w-full text-sm rounded-lg border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 bg-white"
              rows="3"
              placeholder="Deskripsi kategori..."
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsCategoryOpen(false)}>Batal</Button>
            <Button type="submit" loading={submitting}>Simpan Kategori</Button>
          </div>
        </form>
      </Modal>

      {/* Supplier Modal */}
      <Modal
        isOpen={isSupplierOpen}
        onClose={() => setIsSupplierOpen(false)}
        title="Tambah Supplier Baru"
      >
        <form onSubmit={handleSupplierSubmit} className="space-y-4">
          <Input
            label="Nama Supplier / Pemasok"
            value={supplierForm.name}
            onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
            required
            placeholder="Contoh: PT Unilever Indonesia, Sales Indofood..."
          />
          <Input
            label="No. Telepon"
            value={supplierForm.phone}
            onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
            placeholder="Nomor kontak sales..."
          />
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Alamat Kantor / Gudang</label>
            <textarea
              value={supplierForm.address}
              onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
              className="block w-full text-sm rounded-lg border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 bg-white"
              rows="3"
              placeholder="Alamat supplier..."
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsSupplierOpen(false)}>Batal</Button>
            <Button type="submit" loading={submitting}>Simpan Supplier</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!confirmState}
        onClose={() => setConfirmState(null)}
        onConfirm={handleConfirmedDelete}
        loading={deleting}
        message={confirmState?.message}
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


