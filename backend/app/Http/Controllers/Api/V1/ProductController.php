<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index(): JsonResponse
    {
        $products = $this->productService->getAllProducts();
        // Load category and supplier
        $products->load(['category', 'supplier']);
        return response()->json(ProductResource::collection($products));
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = $this->productService->createProduct($request->validated());
        $product->load(['category', 'supplier']);
        return response()->json(new ProductResource($product), 210);
    }

    public function show($id): JsonResponse
    {
        $product = $this->productService->getProductById($id);
        $product->load(['category', 'supplier']);
        return response()->json(new ProductResource($product));
    }

    public function update(UpdateProductRequest $request, $id): JsonResponse
    {
        $product = $this->productService->updateProduct($id, $request->validated());
        $product->load(['category', 'supplier']);
        return response()->json(new ProductResource($product));
    }

    public function destroy($id): JsonResponse
    {
        $this->productService->deleteProduct($id);
        return response()->json(['message' => 'Produk berhasil dihapus']);
    }
}