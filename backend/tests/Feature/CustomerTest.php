<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Customer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::create([
            'name' => 'Kasir',
            'email' => 'kasir@test.com',
            'password' => bcrypt('password'),
            'role' => 'kasir'
        ]);
    }

    public function test_authenticated_user_can_get_customers()
    {
        Customer::create(['name' => 'Pak Budi', 'phone' => '0812345', 'address' => 'RT 01']);

        $response = $this->actingAs($this->user)
                         ->getJson('/api/v1/customers');

        $response->assertStatus(200)
                 ->assertJsonCount(1);
    }

    public function test_user_can_create_customer()
    {
        $response = $this->actingAs($this->user)
                         ->postJson('/api/v1/customers', [
                             'name' => 'Ibu Siti',
                             'phone' => '0812999',
                             'address' => 'RT 02'
                         ]);

        $response->assertStatus(210);
        $this->assertDatabaseHas('customers', ['name' => 'Ibu Siti']);
    }
}