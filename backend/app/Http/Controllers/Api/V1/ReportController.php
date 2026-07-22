<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    protected $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    public function sales(Request $request): JsonResponse
    {
        $summary = $this->reportService->getSalesSummary(
            $request->query('start_date'),
            $request->query('end_date')
        );
        return response()->json($summary);
    }

    public function debts(): JsonResponse
    {
        $summary = $this->reportService->getDebtSummary();
        return response()->json($summary);
    }

    public function stock(): JsonResponse
    {
        $summary = $this->reportService->getInventorySummary();
        return response()->json($summary);
    }

    public function exportExcel(Request $request): StreamedResponse
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        
        $summary = $this->reportService->getSalesSummary($startDate, $endDate);
        
        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename=laporan-penjualan-' . date('Ymd') . '.csv',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        $callback = function() use ($summary) {
            $file = fopen('php://output', 'w');
            
            // UTF-8 BOM for Excel compatibility
            fputs($file, "\xEF\xBB\xBF");
            
            fputcsv($file, ['LAPORAN PENJUALAN WARUNG']);
            fputcsv($file, ['Tanggal Cetak', date('Y-m-d H:i:s')]);
            fputcsv($file, []);
            
            fputcsv($file, ['Ringkasan Keuangan']);
            fputcsv($file, ['Total Penjualan', $summary['total_sales']]);
            fputcsv($file, ['Penjualan Tunai', $summary['cash_sales']]);
            fputcsv($file, ['Penjualan Kasbon', $summary['kasbon_sales']]);
            fputcsv($file, ['Jumlah Transaksi', $summary['transaction_count']]);
            fputcsv($file, []);
            
            fputcsv($file, ['Penjualan Harian']);
            fputcsv($file, ['Tanggal', 'Total Penjualan', 'Jumlah Transaksi']);
            foreach ($summary['daily_sales'] as $day) {
                fputcsv($file, [$day->date, $day->total, $day->count]);
            }
            fputcsv($file, []);
            
            fputcsv($file, ['Produk Terlaris']);
            fputcsv($file, ['Nama Produk', 'Jumlah Terjual', 'Satuan', 'Total Pendapatan']);
            foreach ($summary['top_products'] as $product) {
                fputcsv($file, [$product->name, $product->qty_sold, $product->unit, $product->total_revenue]);
            }
            
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function exportPdf(Request $request)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        
        $summary = $this->reportService->getSalesSummary($startDate, $endDate);
        
        // Return a beautiful HTML report view that can be printed or saved as PDF from client browser
        $html = '<html><head><title>Laporan Penjualan</title>';
        $html .= '<style>body { font-family: sans-serif; color: #333; margin: 40px; } table { width:100%; border-collapse:collapse; margin-top:20px; } th, td { border:1px solid #ddd; padding:10px; text-align:left; } th { background-color:#f4f4f4; }</style>';
        $html .= '</head><body>';
        $html .= '<h2>LAPORAN PENJUALAN WARUNG</h2>';
        $html .= '<p>Tanggal Cetak: ' . date('Y-m-d H:i:s') . '</p>';
        $html .= '<hr/>';
        $html .= '<h3>Ringkasan Keuangan</h3>';
        $html .= '<p>Total Penjualan: Rp ' . number_format($summary['total_sales'], 2, ',', '.') . '</p>';
        $html .= '<p>Penjualan Tunai: Rp ' . number_format($summary['cash_sales'], 2, ',', '.') . '</p>';
        $html .= '<p>Penjualan Kasbon: Rp ' . number_format($summary['kasbon_sales'], 2, ',', '.') . '</p>';
        $html .= '<p>Jumlah Transaksi: ' . $summary['transaction_count'] . '</p>';
        $html .= '<h3>Produk Terlaris</h3>';
        $html .= '<table><thead><tr><th>Nama Produk</th><th>Jumlah Terjual</th><th>Satuan</th><th>Total Pendapatan</th></tr></thead><tbody>';
        foreach ($summary['top_products'] as $product) {
            $html .= '<tr><td>' . $product->name . '</td><td>' . $product->qty_sold . '</td><td>' . $product->unit . '</td><td>Rp ' . number_format($product->total_revenue, 2, ',', '.') . '</td></tr>';
        }
        $html .= '</tbody></table>';
        $html .= '</body></html>';

        return response($html, 200, ['Content-Type' => 'text/html']);
    }
}