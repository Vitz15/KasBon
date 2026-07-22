<?php

namespace App\Services;

use App\Repositories\Interfaces\DebtRepositoryInterface;

class DebtService
{
    protected $debtRepo;

    public function __construct(DebtRepositoryInterface $debtRepo)
    {
        $this->debtRepo = $debtRepo;
    }

    public function getAllDebts(array $filters = [])
    {
        return $this->debtRepo->all($filters);
    }

    public function getDebtById($id)
    {
        return $this->debtRepo->find($id);
    }

    public function createDebt(array $data)
    {
        $data['remaining'] = $data['amount'];
        $data['status'] = 'unpaid';
        return $this->debtRepo->create($data);
    }

    public function payDebt($id, array $data)
    {
        return $this->debtRepo->pay($id, $data);
    }
}