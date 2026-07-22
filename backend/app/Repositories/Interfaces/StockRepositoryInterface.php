<?php

namespace App\Repositories\Interfaces;

interface StockRepositoryInterface
{
    public function all();
    public function createMovement(array $data);
    public function getMovementsByProduct($productId);
}