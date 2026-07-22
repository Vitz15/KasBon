<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Supplier;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Debt;
use App\Models\DebtPayment;
use App\Models\StockMovement;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Users
        $owner = User::create([
            'name' => 'Pemilik Warung',
            'email' => 'owner@warung.com',
            'password' => Hash::make('password'),
            'role' => 'owner',
        ]);

        $kasir = User::create([
            'name' => 'Kasir Warung',
            'email' => 'kasir@warung.com',
            'password' => Hash::make('password'),
            'role' => 'kasir',
        ]);

        // 2. Categories
        $sembako = Category::create(['name' => 'Sembako', 'description' => 'Sembilan Bahan Pokok']);
        $minuman = Category::create(['name' => 'Minuman', 'description' => 'Minuman kemasan, botol, dan galon']);
        $makanan = Category::create(['name' => 'Makanan Ringan', 'description' => 'Snack, mie instan, biscuit']);
        $kebutuhan = Category::create(['name' => 'Kebutuhan Mandi & Cuci', 'description' => 'Sabun, shampoo, deterjen']);
        $rokok = Category::create(['name' => 'Rokok', 'description' => 'Rokok dan tembakau']);

        // 3. Suppliers
        $supIndo = Supplier::create(['name' => 'PT Indofood Sukses Makmur', 'phone' => '021-555123', 'address' => 'Sudirman Plaza, Jakarta']);
        $supUnilever = Supplier::create(['name' => 'PT Unilever Indonesia', 'phone' => '021-555456', 'address' => 'BSD City, Tangerang']);
        $supAgen = Supplier::create(['name' => 'Agen Sembako Subur Jaya', 'phone' => '08123456789', 'address' => 'Pasar Induk Kramat Jati, Jakarta']);

        // 4. Customers
        $custBudi = Customer::create(['name' => 'Pak Budi Santoso', 'phone' => '085211112222', 'address' => 'RT 01 RW 02 No. 10']);
        $custSiti = Customer::create(['name' => 'Ibu Siti Aminah', 'phone' => '085233334444', 'address' => 'RT 02 RW 02 No. 15']);
        $custAgus = Customer::create(['name' => 'Mas Agus Pratama', 'phone' => '085255556666', 'address' => 'RT 03 RW 02 No. 5']);
        $custRina = Customer::create(['name' => 'Mbak Rina Wijaya', 'phone' => '085277778888', 'address' => 'RT 01 RW 02 No. 22']);

        // 5. Products
        $p1 = Product::create([
            'category_id' => $sembako->id,
            'supplier_id' => $supAgen->id,
            'code' => '8992761001001',
            'name' => 'Beras Pandan Wangi 1kg',
            'purchase_price' => 14000.00,
            'selling_price' => 16500.00,
            'stock' => 50,
            'min_stock' => 10,
            'unit' => 'kg',
            'description' => 'Beras kualitas super wangi dan pulen'
        ]);

        $p2 = Product::create([
            'category_id' => $sembako->id,
            'supplier_id' => $supAgen->id,
            'code' => '8999901501300',
            'name' => 'Minyak Goreng Bimoli 1L',
            'purchase_price' => 18000.00,
            'selling_price' => 20500.00,
            'stock' => 24,
            'min_stock' => 8,
            'unit' => 'botol',
            'description' => 'Minyak goreng kelapa sawit bermutu'
        ]);

        $p3 = Product::create([
            'category_id' => $makanan->id,
            'supplier_id' => $supIndo->id,
            'code' => '89686010002',
            'name' => 'Mie Goreng Indomie',
            'purchase_price' => 2700.00,
            'selling_price' => 3500.00,
            'stock' => 120,
            'min_stock' => 20,
            'unit' => 'bungkus',
            'description' => 'Mie instan goreng rasa original'
        ]);

        $p4 = Product::create([
            'category_id' => $makanan->id,
            'supplier_id' => $supIndo->id,
            'code' => '89686010003',
            'name' => 'Indomie Rasa Ayam Bawang',
            'purchase_price' => 2600.00,
            'selling_price' => 3300.00,
            'stock' => 80,
            'min_stock' => 20,
            'unit' => 'bungkus',
            'description' => 'Mie instan kuah rasa ayam bawang'
        ]);

        $p5 = Product::create([
            'category_id' => $minuman->id,
            'supplier_id' => $supAgen->id,
            'code' => '8886008101053',
            'name' => 'Air Mineral Aqua 600ml',
            'purchase_price' => 2800.00,
            'selling_price' => 4000.00,
            'stock' => 4, // Hampir habis untuk test low stock
            'min_stock' => 12,
            'unit' => 'botol',
            'description' => 'Air mineral pegunungan alami'
        ]);

        $p6 = Product::create([
            'category_id' => $minuman->id,
            'supplier_id' => $supAgen->id,
            'code' => '8992696404456',
            'name' => 'Teh Botol Sosro 450ml',
            'purchase_price' => 4500.00,
            'selling_price' => 6000.00,
            'stock' => 36,
            'min_stock' => 10,
            'unit' => 'botol',
            'description' => 'Teh melati manis dalam kemasan plastik'
        ]);

        $p7 = Product::create([
            'category_id' => $kebutuhan->id,
            'supplier_id' => $supUnilever->id,
            'code' => '8999999042211',
            'name' => 'Sabun Mandi Lifebuoy Merah 85g',
            'purchase_price' => 3200.00,
            'selling_price' => 4500.00,
            'stock' => 40,
            'min_stock' => 10,
            'unit' => 'pcs',
            'description' => 'Sabun batang kesehatan anti kuman'
        ]);

        $p8 = Product::create([
            'category_id' => $rokok->id,
            'supplier_id' => $supAgen->id,
            'code' => '8999999002222',
            'name' => 'Rokok Sampoerna Mild 16',
            'purchase_price' => 28000.00,
            'selling_price' => 31000.00,
            'stock' => 15,
            'min_stock' => 5,
            'unit' => 'bungkus',
            'description' => 'Rokok filter rendah tar dan nikotin'
        ]);

        // 6. Stock Movements
        $allProducts = [$p1, $p2, $p3, $p4, $p5, $p6, $p7, $p8];
        foreach ($allProducts as $p) {
            StockMovement::create([
                'product_id' => $p->id,
                'user_id' => $owner->id,
                'type' => 'in',
                'quantity' => $p->stock,
                'reference' => 'Stok Awal',
                'note' => 'Stok awal pembukaan toko',
                'created_at' => Carbon::now()->subDays(10),
            ]);
        }

        // 7. Sales (Tunai)
        $sale1 = Sale::create([
            'user_id' => $kasir->id,
            'customer_id' => null,
            'invoice_number' => 'INV-' . Carbon::now()->subDays(2)->format('ymdHis') . '-001',
            'total_amount' => 37000.00,
            'payment_method' => 'cash',
            'amount_paid' => 50000.00,
            'change_amount' => 13000.00,
            'notes' => 'Pembelian tunai tanpa pelanggan tetap',
            'created_at' => Carbon::now()->subDays(2),
        ]);

        SaleItem::create([
            'sale_id' => $sale1->id,
            'product_id' => $p3->id, // Indomie Goreng
            'quantity' => 5,
            'price' => 3500.00,
            'subtotal' => 17500.00,
        ]);

        SaleItem::create([
            'sale_id' => $sale1->id,
            'product_id' => $p2->id, // Bimoli
            'quantity' => 1,
            'price' => 20500.00,
            'subtotal' => 20500.00,
        ]);

        // 8. Sales (Kasbon)
        $sale2 = Sale::create([
            'user_id' => $kasir->id,
            'customer_id' => $custBudi->id,
            'invoice_number' => 'INV-' . Carbon::now()->subDays(5)->format('ymdHis') . '-002',
            'total_amount' => 104500.00,
            'payment_method' => 'kasbon',
            'amount_paid' => 20000.00, // Bayar muka 20rb
            'change_amount' => 0.00,
            'notes' => 'Kasbon pak budi untuk kebutuhan bulanan',
            'created_at' => Carbon::now()->subDays(5),
        ]);

        SaleItem::create([
            'sale_id' => $sale2->id,
            'product_id' => $p1->id, // Beras
            'quantity' => 2,
            'price' => 16500.00,
            'subtotal' => 33000.00,
        ]);

        SaleItem::create([
            'sale_id' => $sale2->id,
            'product_id' => $p8->id, // Rokok
            'quantity' => 2,
            'price' => 31000.00,
            'subtotal' => 62000.00,
        ]);

        SaleItem::create([
            'sale_id' => $sale2->id,
            'product_id' => $p5->id, // Aqua
            'quantity' => 2,
            'price' => 4000.00,
            'subtotal' => 8000.00,
        ]);

        // Create Debt for Budi
        $debtBudi = Debt::create([
            'customer_id' => $custBudi->id,
            'sale_id' => $sale2->id,
            'amount' => 84500.00, // 104500 - 20000
            'remaining' => 84500.00,
            'description' => 'Hutang dari invoice ' . $sale2->invoice_number,
            'status' => 'unpaid',
            'due_date' => Carbon::now()->addDays(7),
            'created_at' => Carbon::now()->subDays(5),
        ]);

        // Ibu Siti Kasbon
        $sale3 = Sale::create([
            'user_id' => $kasir->id,
            'customer_id' => $custSiti->id,
            'invoice_number' => 'INV-' . Carbon::now()->subDays(3)->format('ymdHis') . '-003',
            'total_amount' => 50000.00,
            'payment_method' => 'kasbon',
            'amount_paid' => 0.00,
            'change_amount' => 0.00,
            'notes' => 'Kasbon Ibu Siti',
            'created_at' => Carbon::now()->subDays(3),
        ]);

        SaleItem::create([
            'sale_id' => $sale3->id,
            'product_id' => $p2->id, // Minyak
            'quantity' => 2,
            'price' => 20500.00,
            'subtotal' => 41000.00,
        ]);

        SaleItem::create([
            'sale_id' => $sale3->id,
            'product_id' => $p4->id, // Indomie Ayam Bawang
            'quantity' => 3,
            'price' => 3300.00,
            'subtotal' => 9000.00,
        ]);

        $debtSiti = Debt::create([
            'customer_id' => $custSiti->id,
            'sale_id' => $sale3->id,
            'amount' => 50000.00,
            'remaining' => 50000.00,
            'description' => 'Hutang dari invoice ' . $sale3->invoice_number,
            'status' => 'unpaid',
            'due_date' => Carbon::now()->addDays(10),
            'created_at' => Carbon::now()->subDays(3),
        ]);

        // Budi pays some of his debt
        DebtPayment::create([
            'debt_id' => $debtBudi->id,
            'user_id' => $kasir->id,
            'amount' => 30000.00,
            'payment_method' => 'cash',
            'note' => 'Cicilan pertama dari pak budi',
            'created_at' => Carbon::now()->subDays(2),
        ]);

        $debtBudi->update([
            'remaining' => 54500.00,
            'status' => 'partial',
        ]);
    }
}