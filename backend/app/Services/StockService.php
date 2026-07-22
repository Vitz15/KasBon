<?php

namespace App\Services;

use App\Repositories\Interfaces\StockRepositoryInterface;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class StockService
{
    protected $stockRepo;

    public function __construct(StockRepositoryInterface $stockRepo)
    {
        $this->stockRepo = $stockRepo;
    }

    public function recordMovement($productId, $userId, $type, $quantity, $reference = null, $note = null)
    {
        return DB::transaction(function () use ($productId, $userId, $type, $quantity, $reference, $note) {
            $product = Product::findOrFail($productId);

            if ($type === 'out' && $product->stock < $quantity) {
                throw new \Exception("Stok produk '{$product->name}' tidak mencukupi. Sisa stok: {$product->stock}.");
            }

            // Create movement record
            $movement = $this->stockRepo->createMovement([
                'product_id' => $productId,
                'user_id' => $userId,
                'type' => $type,
                'quantity' => $quantity,
                'reference' => $reference,
                'note' => $note
            ]);

            // Update product stock
            if ($type === 'in') {
                $product->stock += $quantity;
            } else {
                $product->stock -= $quantity;
            }
            $product->save();

            return $movement;
        });
    }

    public function getStockMovements()
    {
        return $this->stockRepo->all();
    }

    public function getProductStockMovements($productId)
    {
        return $this->stockRepo->getMovementsByProduct($productId);
    }
}