<?php

namespace App\Repositories\Interfaces;

interface DebtRepositoryInterface
{
    public function all(array $filters = []);
    public function find($id);
    public function create(array $data);
    public function pay($id, array $data);
}