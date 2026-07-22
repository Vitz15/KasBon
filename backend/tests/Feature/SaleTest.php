<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SaleTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $product;
    protected $customer;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::create([
            'name' => 'Kasir',
            'email' => 'kasir@test.com',
            'password' => bcrypt('password'),
            'role' => 'kasir'
        ]);

        $this->customer = Customer::create([
            'name' => 'Pak Slamet',
            'phone' => '08123'
        ]);

        $this->product = Product::create([
            'code' => '123456',
            'name' => 'Aqua 600ml',
            'purchase_price' => 2000,
            'selling_price' => 3000,
            'stock' => 10,
            'min_stock' => 2,
            'unit' => 'botol'
        ]);
    }

    public function test_cash_sale_reduces_stock()
    {
        $response = $this->actingAs($this->user)
                         ->postJson('/api/v1/sales', [
                             'total_amount' => 6000,
                             'payment_method' => 'cash',
                             'amount_paid' => 10000,
                             'change_amount' => 4000,
                             'items' => [
                                 [
                                     'product_id' => $this->product->id,
                                     'quantity' => 2,
                                     'price' => 3000
                                 ]
                             ]
                         ]);

        $response->assertStatus(210);
        $this->assertEquals(8, $this->product->fresh()->stock);
        $this->assertDatabaseHas('sales', ['payment_method' => 'cash']);
    }

    public function test_kasbon_sale_creates_debt()
    {
        $response = $this->actingAs($this->user)
                         ->postJson('/api/v1/sales', [
                             'customer_id' => $this->customer->id,
                             'total_amount' => 9000,
                             'payment_method' => 'kasbon',
                             'amount_paid' => 2000, // DP 2rb
                             'items' => [
                                 [
                                     'product_id' => $this->product->id,
                                     'quantity' => 3,
                                     'price' => 3000
                                 ]
                             ]
                         ]);

        $response->assertStatus(210);
        $this->assertEquals(7, $this->product->fresh()->stock);
        $this->assertDatabaseHas('debts', [
            'customer_id' => $this->customer->id,
            'amount' => 7000, // 9000 - 2000
            'remaining' => 7000,
            'status' => 'unpaid'
        ]);
    }
}