<?php

namespace App\Repositories\Eloquent;

use App\Models\StockMovement;
use App\Repositories\Interfaces\StockRepositoryInterface;

class StockRepository implements StockRepositoryInterface
{
    public function all()
    {
        return StockMovement::with(['product', 'user'])->orderBy('created_at', 'desc')->get();
    }

    public function createMovement(array $data)
    {
        return StockMovement::create($data);
    }

    public function getMovementsByProduct($productId)
    {
        return StockMovement::where('product_id', $productId)->with('user')->orderBy('created_at', 'desc')->get();
    }
}