<?php

namespace App\Services;

use App\Repositories\Interfaces\SaleRepositoryInterface;
use App\Models\SaleItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SaleService
{
    protected $saleRepo;
    protected $stockService;
    protected $debtService;

    public function __construct(
        SaleRepositoryInterface $saleRepo,
        StockService $stockService,
        DebtService $debtService
    ) {
        $this->saleRepo = $saleRepo;
        $this->stockService = $stockService;
        $this->debtService = $debtService;
    }

    public function getAllSales()
    {
        return $this->saleRepo->all();
    }

    public function getSaleById($id)
    {
        return $this->saleRepo->find($id);
    }

    public function createSale(array $data, $userId)
    {
        return DB::transaction(function () use ($data, $userId) {
            // 1. Generate unique invoice number
            $invoiceNumber = 'INV-' . Carbon::now()->format('ymdHis') . '-' . rand(100, 999);

            // 2. Create the Sale record
            $sale = $this->saleRepo->create([
                'user_id' => $userId,
                'customer_id' => $data['customer_id'] ?? null,
                'invoice_number' => $invoiceNumber,
                'total_amount' => $data['total_amount'],
                'payment_method' => $data['payment_method'],
                'amount_paid' => $data['amount_paid'] ?? 0,
                'change_amount' => $data['change_amount'] ?? 0,
                'notes' => $data['notes'] ?? null,
            ]);

            // 3. Create Sale Items & Update Stock
            foreach ($data['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                // Record stock movement (will throw exception if stock insufficient)
                $this->stockService->recordMovement(
                    $product->id,
                    $userId,
                    'out',
                    $item['quantity'],
                    $invoiceNumber,
                    'Penjualan kasir'
                );

                // Create item
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $item['quantity'] * $item['price'],
                ]);
            }

            // 4. Handle Kasbon if payment method is kasbon
            if ($data['payment_method'] === 'kasbon') {
                if (!isset($data['customer_id'])) {
                    throw new \Exception("Pelanggan harus dipilih jika menggunakan metode Kasbon.");
                }

                $outstandingAmount = $data['total_amount'] - ($data['amount_paid'] ?? 0);
                
                if ($outstandingAmount > 0) {
                    $this->debtService->createDebt([
                        'customer_id' => $data['customer_id'],
                        'sale_id' => $sale->id,
                        'amount' => $outstandingAmount,
                        'due_date' => $data['due_date'] ?? Carbon::now()->addDays(7)->format('Y-m-d'),
                        'description' => 'Kasbon dari transaksi ' . $invoiceNumber,
                    ]);
                }
            }

            return $sale;
        });
    }
}