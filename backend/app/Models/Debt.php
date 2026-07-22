<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Debt extends Model
{
    protected $fillable = [
        'customer_id',
        'sale_id',
        'amount',
        'remaining',
        'description',
        'status',
        'due_date'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'remaining' => 'decimal:2',
        'due_date' => 'date',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function payments()
    {
        return $this->hasMany(DebtPayment::class);
    }
}