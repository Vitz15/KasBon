<?php

namespace App\Repositories\Eloquent;

use App\Models\Customer;
use App\Repositories\Interfaces\CustomerRepositoryInterface;

class CustomerRepository implements CustomerRepositoryInterface
{
    public function all()
    {
        return Customer::withSum(['debts' => function ($query) {
            $query->where('status', '!=', 'paid');
        }], 'remaining')->get();
    }

    public function find($id)
    {
        return Customer::findOrFail($id);
    }

    public function create(array $data)
    {
        return Customer::create($data);
    }

    public function update($id, array $data)
    {
        $customer = $this->find($id);
        $customer->update($data);
        return $customer;
    }

    public function delete($id)
    {
        $customer = $this->find($id);
        return $customer->delete();
    }

    public function getDebts($id)
    {
        return $this->find($id)->debts()->with('sale')->orderBy('created_at', 'desc')->get();
    }
}