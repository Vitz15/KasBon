# 🧪 KasBon Digital & Inventaris Warung — Quality Assurance & Testing

This document contains testing guidelines, manual test cases, responsive grids checklist, and security verify requirements for both backend (Laravel) and frontend (Next.js) apps.

## 1. Automated Testing (Backend Feature Tests)

To run the automated PHPUnit test suite, execute:
```bash
php artisan test
```
The following feature tests are implemented in the `tests/Feature/` directory:
- **`AuthTest.php`**: Registers users, logs in, checks profile access control, validates bearer token security.
- **`CustomerTest.php`**: Validates customer listing and creation constraints.
- **`SaleTest.php`**: Simulates POS checkout, validates transaction records, verifies automatic stock deduction, verifies automatic debt registration on kasbon checkout.
- **`DebtTest.php`**: Simulates partial/full debt payments, checks status change logic (`unpaid` -> `partial` -> `paid`).
- **`ReportTest.php`**: Verifies role-based access control (RBAC) on reports (requires `owner` role, blocks `kasir`).

## 2. Manual Test Cases (E2E Verification)

| Fitur | Langkah Pengujian | Ekspektasi Hasil |
|---|---|---|
| **Autentikasi (Register)** | Isi form pendaftaran, pilih role 'owner' atau 'kasir', kirim. | Akun tersimpan dengan kata sandi ter-hash, diarahkan ke login. |
| **Autentikasi (Login)** | Isi email & password yang terdaftar, klik masuk. | Token Sanctum dibuat, disimpan di localStorage, masuk ke dashboard. |
| **POS Kasir (Transaksi Tunai)** | Masukkan produk ke keranjang, klik Bayar, pilih Tunai, masukkan jumlah uang pas/lebih, klik proses. | Stok produk berkurang, struk belanja dicetak, transaksi tercatat di sales. |
| **POS Kasir (Transaksi KasBon)** | Masukkan produk ke keranjang, klik Bayar, pilih KasBon, pilih nama pelanggan, tentukan tanggal jatuh tempo, klik proses. | Stok berkurang, data hutang terbuat di Buku KasBon untuk pelanggan terpilih. |
| **Buku KasBon (Pembayaran)** | Buka detail KasBon aktif pelanggan, klik "Bayar Cicilan", masukkan nominal bayar, simpan. | Sisa hutang berkurang, riwayat cicilan bertambah, status menjadi `Dicicil` atau `Lunas`. |
| **Profil Pelanggan (WhatsApp)** | Buka profil pelanggan yang memiliki nomor WA dan hutang aktif. | Tombol WhatsApp Web terbuka berisi pesan draf pengingat nominal hutang otomatis yang sopan. |
| **Laporan Ekspor** | Buka tab Laporan, ubah range tanggal, klik "Ekspor CSV" atau "Print Laporan" (Owner Only). | Berhasil mengunduh dokumen CSV atau membuka preview cetak HTML laporan. |

## 3. Responsive Web Design Checklist

The frontend is fully responsive and supports three screen profiles:
- [ ] **Mobile (375px)**:
  - Sidebar collapses into a sliding hamburger overlay or mobile nav.
  - POS cashier screen stacks (product selection list on top, cart drawer on bottom).
  - Stat cards display in a single-column layout.
- [ ] **Tablet (768px)**:
  - Sidebar collapses into a mini-dock or expands normally.
  - POS cashier changes into a two-column sidebar layout.
  - Summary charts stack vertically.
- [ ] **Desktop (1280px+)**:
  - Full sidebar layout.
  - Three-column POS layouts (product grid left, cart panel right).
  - Stat cards show in a 4-column horizontal grid.

## 4. Security Checklist

- **SQL Injection Prevention**: Eloquent ORM is used throughout all controllers, automatically escaping inputs. Raw SQL inputs are avoided.
- **XSS Prevention**: React automatically escapes text contents rendered in the DOM. Raw HTML is strictly escaped.
- **CSRF Protection**: Laravel Sanctum utilizes cookie-based CSRF guards for stateful SPA request validations.
- **Rate Limiting**: Configured in Laravel on sensitive auth endpoints:
  - `throttle:api` (60 requests per minute per IP address).
  - Sensitive login/register throttled at 5 requests per minute.