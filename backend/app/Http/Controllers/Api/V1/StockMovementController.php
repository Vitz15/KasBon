<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Stock\StoreStockMovementRequest;
use App\Http\Resources\StockMovementResource;
use App\Services\StockService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class StockMovementController extends Controller
{
    protected $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    public function index(Request $request): JsonResponse
    {
        if ($request->has('product_id')) {
            $movements = $this->stockService->getProductStockMovements($request->product_id);
        } else {
            $movements = $this->stockService->getStockMovements();
        }
        $movements->load(['product', 'user']);
        return response()->json(StockMovementResource::collection($movements));
    }

    public function store(StoreStockMovementRequest $request): JsonResponse
    {
        try {
            $movement = $this->stockService->recordMovement(
                $request->product_id,
                $request->user()->id,
                $request->type,
                $request->quantity,
                $request->reference,
                $request->note
            );
            $movement->load(['product', 'user']);
            return response()->json(new StockMovementResource($movement), 210);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}