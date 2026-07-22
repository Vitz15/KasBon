<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Http\Resources\DebtResource;
use App\Services\CustomerService;
use Illuminate\Http\JsonResponse;

class CustomerController extends Controller
{
    protected $customerService;

    public function __construct(CustomerService $customerService)
    {
        $this->customerService = $customerService;
    }

    public function index(): JsonResponse
    {
        $customers = $this->customerService->getAllCustomers();
        return response()->json(CustomerResource::collection($customers));
    }

    public function store(StoreCustomerRequest $request): JsonResponse
    {
        $customer = $this->customerService->createCustomer($request->validated());
        return response()->json(new CustomerResource($customer), 210);
    }

    public function show($id): JsonResponse
    {
        $customer = $this->customerService->getCustomerById($id);
        return response()->json(new CustomerResource($customer));
    }

    public function update(UpdateCustomerRequest $request, $id): JsonResponse
    {
        $customer = $this->customerService->updateCustomer($id, $request->validated());
        return response()->json(new CustomerResource($customer));
    }

    public function destroy($id): JsonResponse
    {
        $this->customerService->deleteCustomer($id);
        return response()->json(['message' => 'Pelanggan berhasil dihapus']);
    }

    public function debts($id): JsonResponse
    {
        $debts = $this->customerService->getCustomerDebts($id);
        return response()->json(DebtResource::collection($debts));
    }
}