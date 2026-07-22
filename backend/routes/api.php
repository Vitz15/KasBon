<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CustomerController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\SupplierController;
use App\Http\Controllers\Api\V1\SaleController;
use App\Http\Controllers\Api\V1\DebtController;
use App\Http\Controllers\Api\V1\StockMovementController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\ReportController;

Route::prefix('v1')->group(function () {
    // Public Auth routes
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']); // Can be secured depending on system needs

    // Authenticated API routes
    Route::middleware('auth:sanctum')->group(function () {
        // Auth profile and logout
        Route::get('/auth/profile', [AuthController::class, 'profile']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // Customers CRUD & history
        Route::apiResource('customers', CustomerController::class);
        Route::get('customers/{customer}/debts', [CustomerController::class, 'debts']);

        // Products CRUD
        Route::apiResource('products', ProductController::class);

        // Categories & Suppliers CRUD
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('suppliers', SupplierController::class);

        // Sales POS Transactions
        Route::get('sales', [SaleController::class, 'index']);
        Route::post('sales', [SaleController::class, 'store']);
        Route::get('sales/{sale}', [SaleController::class, 'show']);

        // Debts Ledger
        Route::get('debts', [DebtController::class, 'index']);
        Route::get('debts/{debt}', [DebtController::class, 'show']);
        Route::post('debts/{debt}/pay', [DebtController::class, 'pay']);

        // Stock Movements (In/Out logs)
        Route::get('stock-movements', [StockMovementController::class, 'index']);
        Route::post('stock-movements', [StockMovementController::class, 'store']);

        // Reports (accessible to Owner only)
        Route::middleware('role:owner')->group(function () {
            Route::get('reports/sales', [ReportController::class, 'sales']);
            Route::get('reports/debts', [ReportController::class, 'debts']);
            Route::get('reports/stock', [ReportController::class, 'stock']);
            Route::get('reports/export/excel', [ReportController::class, 'exportExcel']);
            Route::get('reports/export/pdf', [ReportController::class, 'exportPdf']);
        });
    });
});