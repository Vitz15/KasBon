<?php

namespace App\Services;

use App\Models\Sale;
use App\Models\Debt;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportService
{
    public function getSalesSummary($startDate = null, $endDate = null)
    {
        $start = $startDate ? Carbon::parse($startDate)->startOfDay() : Carbon::now()->subDays(30)->startOfDay();
        $end = $endDate ? Carbon::parse($endDate)->endOfDay() : Carbon::now()->endOfDay();

        $salesQuery = Sale::whereBetween('created_at', [$start, $end]);

        $totalSales = $salesQuery->sum('total_amount');
        $cashSales = (clone $salesQuery)->where('payment_method', 'cash')->sum('total_amount');
        $kasbonSales = (clone $salesQuery)->where('payment_method', 'kasbon')->sum('total_amount');
        $transactionCount = $salesQuery->count();

        // Daily chart data
        $dailySales = Sale::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(total_amount) as total'),
            DB::raw('COUNT(id) as count')
        )
        ->whereBetween('created_at', [$start, $end])
        ->groupBy('date')
        ->orderBy('date')
        ->get();

        // Top selling products
        $topProducts = DB::table('sale_items')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->select('products.name', 'products.unit', DB::raw('SUM(sale_items.quantity) as qty_sold'), DB::raw('SUM(sale_items.subtotal) as total_revenue'))
            ->whereBetween('sales.created_at', [$start, $end])
            ->groupBy('products.id', 'products.name', 'products.unit')
            ->orderBy('qty_sold', 'desc')
            ->limit(5)
            ->get();

        return [
            'total_sales' => $totalSales,
            'cash_sales' => $cashSales,
            'kasbon_sales' => $kasbonSales,
            'transaction_count' => $transactionCount,
            'daily_sales' => $dailySales,
            'top_products' => $topProducts
        ];
    }

    public function getDebtSummary()
    {
        $totalDebt = Debt::sum('amount');
        $remainingDebt = Debt::whereIn('status', ['unpaid', 'partial'])->sum('remaining');
        $paidDebt = Debt::where('status', 'paid')->sum('amount') + Debt::where('status', 'partial')->sum(DB::raw('amount - remaining'));

        // Debts by customer top 5
        $customerDebts = DB::table('debts')
            ->join('customers', 'debts.customer_id', '=', 'customers.id')
            ->select('customers.name', DB::raw('SUM(debts.remaining) as active_debt'))
            ->whereIn('debts.status', ['unpaid', 'partial'])
            ->groupBy('customers.id', 'customers.name')
            ->orderBy('active_debt', 'desc')
            ->limit(5)
            ->get();

        // Overdue debts
        $overdueDebts = Debt::with('customer')
            ->whereIn('status', ['unpaid', 'partial'])
            ->where('due_date', '<', Carbon::now()->toDateString())
            ->orderBy('due_date')
            ->get();

        return [
            'total_debt_recorded' => $totalDebt,
            'active_debt_remaining' => $remainingDebt,
            'total_debt_paid' => $paidDebt,
            'top_customers' => $customerDebts,
            'overdue' => $overdueDebts
        ];
    }

    public function getInventorySummary()
    {
        $totalProducts = Product::count();
        $totalStock = Product::sum('stock');
        
        // Value of stock (purchase price * stock)
        $stockValue = Product::select(DB::raw('SUM(purchase_price * stock) as value'))->first()->value ?? 0;
        $sellingValue = Product::select(DB::raw('SUM(selling_price * stock) as value'))->first()->value ?? 0;
        $potentialProfit = $sellingValue - $stockValue;

        // Low stock products
        $lowStockProducts = Product::whereRaw('stock <= min_stock')
            ->with(['category', 'supplier'])
            ->orderBy('stock')
            ->get();

        return [
            'total_products' => $totalProducts,
            'total_stock_qty' => $totalStock,
            'inventory_cost_value' => $stockValue,
            'inventory_selling_value' => $sellingValue,
            'potential_profit' => $potentialProfit,
            'low_stock_items' => $lowStockProducts
        ];
    }
}