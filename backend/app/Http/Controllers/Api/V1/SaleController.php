<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Sale\StoreSaleRequest;
use App\Http\Resources\SaleResource;
use App\Services\SaleService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SaleController extends Controller
{
    protected $saleService;

    public function __construct(SaleService $saleService)
    {
        $this->saleService = $saleService;
    }

    public function index(): JsonResponse
    {
        $sales = $this->saleService->getAllSales();
        $sales->load(['user', 'customer', 'items.product']);
        return response()->json(SaleResource::collection($sales));
    }

    public function store(StoreSaleRequest $request): JsonResponse
    {
        try {
            $sale = $this->saleService->createSale($request->validated(), $request->user()->id);
            $sale->load(['user', 'customer', 'items.product', 'debt']);
            return response()->json(new SaleResource($sale), 210);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function show($id): JsonResponse
    {
        $sale = $this->saleService->getSaleById($id);
        return response()->json(new SaleResource($sale));
    }
}