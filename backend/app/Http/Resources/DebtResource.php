<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DebtResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_id' => $this->customer_id,
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'sale_id' => $this->sale_id,
            'sale' => new SaleResource($this->whenLoaded('sale')),
            'amount' => $this->amount,
            'remaining' => $this->remaining,
            'description' => $this->description,
            'status' => $this->status,
            'due_date' => $this->due_date ? $this->due_date->format('Y-m-d') : null,
            'payments' => DebtPaymentResource::collection($this->whenLoaded('payments')),
            'created_at' => $this->created_at,
        ];
    }
}