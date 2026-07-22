# 🛒 KasBon Digital & Inventaris Warung (UMKM)

Aplikasi manajemen Buku KasBon (Buku Hutang Pelanggan) dan Inventaris Stok Barang untuk warung kelontong (UMKM). Aplikasi ini terintegrasi penuh antara modul Kasir (POS), Manajemen Stok (Inventaris), Manajemen Pelanggan (Buku KasBon), dan Laporan Keuangan (Owner Only).

## 🚀 Fitur Utama
1. **Dashboard Analytics**: Ringkasan finansial (total kasbon aktif, omzet harian, sisa stok) dan chart tren pendapatan.
2. **Mesin Kasir (POS)**: Memproses transaksi tunai & kasbon secara instan, otomatis mengurangi stok barang.
3. **Buku KasBon**: Daftar tagihan per pelanggan, pencatatan pembayaran cicilan/lunas, dan status telat jatuh tempo.
4. **WhatsApp Reminder**: Integrasi pengiriman pesan pengingat tagihan otomatis ke nomor WhatsApp pelanggan dengan satu klik.
5. **Inventaris**: Manajemen katalog produk, restock manual, warning stok menipis, dan analisis keuntungan.
6. **Laporan & Ekspor**: Grafik terlaris dan ekspor data pembukuan ke CSV/PDF (Owner Only).

---

## 🛠️ Tech Stack

### Backend
- **Laravel 12 / PHP 8.3**
- **MySQL 8.0** (Database Utama)
- **Laravel Sanctum** (Autentikasi Token)
- **Repository Pattern + Service Layer** (Desain Arsitektur)

### Frontend
- **Next.js 14 (App Router)**
- **Tailwind CSS** (Styling Modern)
- **Zustand** (State Management)
- **Recharts** (Visualisasi Grafik)

### DevOps & Deploy
- **Docker + Docker Compose**
- **Nginx** (Reverse Proxy & Routing)
- **GitHub Actions** (CI/CD Pipeline)

---

## 🐳 Cara Menjalankan Menggunakan Docker (Rekomendasi)

Pastikan Anda telah memasang **Docker** dan **Docker Compose** di komputer Anda.

1. **Clone repositori dan masuk ke direktori**:
   ```bash
   cd KasBon
   ```

2. **Salin file konfigurasi environment**:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. **Jalankan aplikasi dengan Docker Compose**:
   ```bash
   docker compose up -d --build
   ```

4. **Jalankan migrasi database & seed data awal**:
   ```bash
   docker compose exec app php artisan migrate --seed
   ```

5. **Akses aplikasi di browser**:
   - **Frontend & Routing (Nginx)**: [http://localhost](http://localhost)
   - **Backend API**: [http://localhost/api/v1](http://localhost/api/v1)

---

## 💻 Cara Menjalankan Secara Manual (Development Lokal)

### Langkah 1: Backend (Laravel)
1. Masuk ke folder backend:
   ```bash
   cd backend
   ```
2. Pasang dependensi PHP:
   ```bash
   composer install
   ```
3. Salin file `.env`, buat database MySQL baru, dan sesuaikan kredensial database di `.env`.
4. Generate key & jalankan migrasi seeder:
   ```bash
   php artisan key:generate
   php artisan migrate --seed
   ```
5. Jalankan server backend:
   ```bash
   php artisan serve
   ```

### Langkah 2: Frontend (Next.js)
1. Masuk ke folder frontend:
   ```bash
   cd ../frontend
   ```
2. Pasang dependensi Node:
   ```bash
   npm install
   ```
3. Salin file `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   ```
4. Jalankan aplikasi Next.js dalam mode development:
   ```bash
   npm run dev
   ```
5. Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 🔑 Data Login Uji Coba (Default Credentials)

Gunakan akun uji coba bawaan seeder untuk masuk ke dashboard:

* **Akun Owner (Pemilik Toko)**:
  - **Email**: `owner@warung.com`
  - **Password**: `password`
  - *Memiliki akses ke semua fitur termasuk Laporan Keuangan dan Ekspor data.*

* **Akun Kasir**:
  - **Email**: `kasir@warung.com`
  - **Password**: `password`
  - *Memiliki akses terbatas untuk POS kasir, inventaris, dan input cicilan kasbon.*