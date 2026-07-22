<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Customer;
use App\Models\Debt;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DebtTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $customer;
    protected $debt;

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
            'name' => 'Agus',
            'phone' => '0823'
        ]);

        $this->debt = Debt::create([
            'customer_id' => $this->customer->id,
            'amount' => 50000,
            'remaining' => 50000,
            'status' => 'unpaid'
        ]);
    }

    public function test_partial_payment()
    {
        $response = $this->actingAs($this->user)
                         ->postJson("/api/v1/debts/{$this->debt->id}/pay", [
                             'amount' => 20000,
                             'payment_method' => 'cash',
                             'note' => 'Cicilan 1'
                         ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('debts', [
            'id' => $this->debt->id,
            'remaining' => 30000,
            'status' => 'partial'
        ]);
    }

    public function test_full_payment_marks_as_paid()
    {
        $response = $this->actingAs($this->user)
                         ->postJson("/api/v1/debts/{$this->debt->id}/pay", [
                             'amount' => 50000,
                             'payment_method' => 'cash',
                             'note' => 'Lunas'
                         ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('debts', [
            'id' => $this->debt->id,
            'remaining' => 0,
            'status' => 'paid'
        ]);
    }
}