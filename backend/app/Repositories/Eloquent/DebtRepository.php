<?php

namespace App\Repositories\Eloquent;

use App\Models\Debt;
use App\Models\DebtPayment;
use App\Repositories\Interfaces\DebtRepositoryInterface;
use Illuminate\Support\Facades\DB;

class DebtRepository implements DebtRepositoryInterface
{
    public function all(array $filters = [])
    {
        $query = Debt::with(['customer', 'sale']);

        if (isset($filters['status']) && $filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function find($id)
    {
        return Debt::with(['customer', 'sale.items.product', 'payments.user'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return Debt::create($data);
    }

    public function pay($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $debt = Debt::findOrFail($id);
            
            // Create payment record
            $payment = DebtPayment::create([
                'debt_id' => $debt->id,
                'user_id' => $data['user_id'],
                'amount' => $data['amount'],
                'payment_method' => $data['payment_method'] ?? 'cash',
                'note' => $data['note'] ?? null,
            ]);

            // Update remaining debt
            $debt->remaining -= $data['amount'];
            
            if ($debt->remaining <= 0) {
                $debt->remaining = 0;
                $debt->status = 'paid';
            } else {
                $debt->status = 'partial';
            }

            $debt->save();

            return $debt;
        });
    }
}