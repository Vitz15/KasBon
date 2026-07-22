<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register()
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Test Kasir',
            'email' => 'kasir@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'kasir'
        ]);

        $response->assertStatus(210) // Created
                 ->assertJsonStructure([
                     'message',
                     'user' => ['id', 'name', 'email', 'role']
                 ]);

        $this->assertDatabaseHas('users', ['email' => 'kasir@test.com']);
    }

    public function test_user_can_login()
    {
        $user = User::create([
            'name' => 'Owner Warung',
            'email' => 'owner@test.com',
            'password' => bcrypt('password123'),
            'role' => 'owner'
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'owner@test.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'message',
                     'user',
                     'token'
                 ]);
    }

    public function test_unauthenticated_user_cannot_access_profile()
    {
        $response = $this->getJson('/api/v1/auth/profile');
        $response->assertStatus(401);
    }
}