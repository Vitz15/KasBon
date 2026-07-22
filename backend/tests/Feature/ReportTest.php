<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    protected $owner;
    protected $kasir;

    protected function setUp(): void
    {
        parent::setUp();
        $this->owner = User::create([
            'name' => 'Owner',
            'email' => 'owner@test.com',
            'password' => bcrypt('password'),
            'role' => 'owner'
        ]);

        $this->kasir = User::create([
            'name' => 'Kasir',
            'email' => 'kasir@test.com',
            'password' => bcrypt('password'),
            'role' => 'kasir'
        ]);
    }

    public function test_owner_can_access_reports()
    {
        $response = $this->actingAs($this->owner)
                         ->getJson('/api/v1/reports/sales');

        $response->assertStatus(200);
    }

    public function test_kasir_cannot_access_reports()
    {
        $response = $this->actingAs($this->kasir)
                         ->getJson('/api/v1/reports/sales');

        $response->assertStatus(403);
    }
}