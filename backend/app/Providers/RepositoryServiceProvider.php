<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Interfaces\CustomerRepositoryInterface;
use App\Repositories\Eloquent\CustomerRepository;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use App\Repositories\Eloquent\ProductRepository;
use App\Repositories\Interfaces\SaleRepositoryInterface;
use App\Repositories\Eloquent\SaleRepository;
use App\Repositories\Interfaces\DebtRepositoryInterface;
use App\Repositories\Eloquent\DebtRepository;
use App\Repositories\Interfaces\StockRepositoryInterface;
use App\Repositories\Eloquent\StockRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CustomerRepositoryInterface::class, CustomerRepository::class);
        $this->app->bind(ProductRepositoryInterface::class, ProductRepository::class);
        $this->app->bind(SaleRepositoryInterface::class, SaleRepository::class);
        $this->app->bind(DebtRepositoryInterface::class, DebtRepository::class);
        $this->app->bind(StockRepositoryInterface::class, StockRepository::class);
    }

    public function boot(): void
    {
        //
    }
}