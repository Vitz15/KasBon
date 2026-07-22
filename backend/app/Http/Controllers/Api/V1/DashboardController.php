<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Debt;
use App\Models\Customer;
use App\Models\Sale;
use App\Models\Product;
use App\Http\Resources\SaleResource;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        // 1. Total active debt (sisa hutang aktif)
        $totalActiveDebt = Debt::whereIn('status', ['unpaid', 'partial'])->sum('remaining');

        // 2. Total customers who currently have debt
        $customerWithDebtCount = Customer::whereHas('debts', function ($query) {
            $query->whereIn('status', ['unpaid', 'partial']);
        })->count();

        // 3. Sales revenue today
        $todaySales = Sale::whereDate('created_at', Carbon::today())->sum('total_amount');

        // 4. Products with low stock
        $lowStockCount = Product::whereRaw('stock <= min_stock')->count();

        // 5. Recent sales (5 transactions)
        $recentSales = Sale::with(['customer', 'user'])->orderBy('created_at', 'desc')->limit(5)->get();

        // 6. Top 5 customers with most active debts
        $topDebtors = DB::table('debts')
            ->join('customers', 'debts.customer_id', '=', 'customers.id')
            ->select('customers.name', DB::raw('SUM(debts.remaining) as active_debt'))
            ->whereIn('debts.status', ['unpaid', 'partial'])
            ->groupBy('customers.id', 'customers.name')
            ->orderBy('active_debt', 'desc')
            ->limit(5)
            ->get();

        // 7. Last 7 days sales chart
        $days = [];
        $salesData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $days[] = $date->isoFormat('dddd');
            $salesData[] = Sale::whereDate('created_at', $date)->sum('total_amount');
        }

        return response()->json([
            'summary' => [
                'total_active_debt' => (float)$totalActiveDebt,
                'customers_with_debt' => $customerWithDebtCount,
                'today_sales' => (float)$todaySales,
                'low_stock_count' => $lowStockCount
            ],
            'recent_sales' => SaleResource::collection($recentSales),
            'top_debtors' => $topDebtors,
            'chart_sales' => [
                'labels' => $days,
                'data' => $salesData
            ]
        ]);
    }
}