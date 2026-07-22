<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DebtPaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'debt_id' => $this->debt_id,
            'user' => new UserResource($this->whenLoaded('user')),
            'amount' => $this->amount,
            'payment_method' => $this->payment_method,
            'note' => $this->note,
            'created_at' => $this->created_at,
        ];
    }
}