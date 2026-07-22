<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'supplier_id' => $this->supplier_id,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'supplier' => new SupplierResource($this->whenLoaded('supplier')),
            'code' => $this->code,
            'name' => $this->name,
            'purchase_price' => $this->purchase_price,
            'selling_price' => $this->selling_price,
            'stock' => $this->stock,
            'min_stock' => $this->min_stock,
            'unit' => $this->unit,
            'description' => $this->description,
            'is_low_stock' => $this->isLowStock(),
            'created_at' => $this->created_at,
        ];
    }
}