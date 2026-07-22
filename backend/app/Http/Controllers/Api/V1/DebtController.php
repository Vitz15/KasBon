<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Debt\PayDebtRequest;
use App\Http\Resources\DebtResource;
use App\Services\DebtService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DebtController extends Controller
{
    protected $debtService;

    public function __construct(DebtService $debtService)
    {
        $this->debtService = $debtService;
    }

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['status', 'customer_id']);
        $debts = $this->debtService->getAllDebts($filters);
        $debts->load(['customer', 'sale']);
        return response()->json(DebtResource::collection($debts));
    }

    public function show($id): JsonResponse
    {
        $debt = $this->debtService->getDebtById($id);
        return response()->json(new DebtResource($debt));
    }

    public function pay(PayDebtRequest $request, $id): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        try {
            $debt = $this->debtService->payDebt($id, $data);
            $debt->load(['customer', 'sale', 'payments.user']);
            return response()->json([
                'message' => 'Pembayaran hutang berhasil direkam',
                'debt' => new DebtResource($debt)
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}