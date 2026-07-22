<?php

namespace App\Repositories\Interfaces;

interface SaleRepositoryInterface
{
    public function all();
    public function find($id);
    public function create(array $data);
}