<?php

namespace App\Repositories\Eloquent;

use App\Models\Sale;
use App\Repositories\Interfaces\SaleRepositoryInterface;

class SaleRepository implements SaleRepositoryInterface
{
    public function all()
    {
        return Sale::with(['user', 'customer', 'items.product'])->orderBy('created_at', 'desc')->get();
    }

    public function find($id)
    {
        return Sale::with(['user', 'customer', 'items.product', 'debt'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return Sale::create($data);
    }
}