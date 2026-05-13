<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test users
        User::create([
            'name' => 'Admin Test',
            'username' => 'admin_test',
            'email' => 'admin@test.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Staff Test',
            'username' => 'staff_test',
            'email' => 'staff@test.com',
            'password' => bcrypt('password123'),
            'role' => 'staff',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Inactive Staff',
            'username' => 'inactive_staff',
            'email' => 'inactive@test.com',
            'password' => bcrypt('password123'),
            'role' => 'staff',
            'is_active' => false,
        ]);
    }

    /**
     * Test staff login page is accessible
     */
    public function test_staff_login_page_is_accessible(): void
    {
        $response = $this->get('/staff/login');
        $response->assertStatus(200);
    }

    /**
     * Test admin login page is accessible
     */
    public function test_admin_login_page_is_accessible(): void
    {
        $response = $this->get('/admin/login');
        $response->assertStatus(200);
    }

    /**
     * Test staff can login with valid credentials
     */
    public function test_staff_can_login_with_valid_credentials(): void
    {
        $response = $this->post('/staff/login', [
            'username' => 'staff_test',
            'password' => 'password123',
        ]);

        $response->assertRedirect('/staff/dashboard');
        $this->assertAuthenticatedAs(User::where('username', 'staff_test')->first());
    }

    /**
     * Test admin can login with valid credentials
     */
    public function test_admin_can_login_with_valid_credentials(): void
    {
        $response = $this->post('/admin/login', [
            'username' => 'admin_test',
            'password' => 'password123',
        ]);

        $response->assertRedirect('/admin/overview');
        $this->assertAuthenticatedAs(User::where('username', 'admin_test')->first());
    }

    /**
     * Test staff cannot login with invalid credentials
     */
    public function test_staff_cannot_login_with_invalid_credentials(): void
    {
        $response = $this->post('/staff/login', [
            'username' => 'staff_test',
            'password' => 'wrong_password',
        ]);

        $response->assertSessionHasErrors('username');
        $this->assertGuest();
    }

    /**
     * Test admin cannot login with invalid credentials
     */
    public function test_admin_cannot_login_with_invalid_credentials(): void
    {
        $response = $this->post('/admin/login', [
            'username' => 'admin_test',
            'password' => 'wrong_password',
        ]);

        $response->assertSessionHasErrors('username');
        $this->assertGuest();
    }

    /**
     * Test inactive staff cannot login
     */
    public function test_inactive_staff_cannot_login(): void
    {
        $response = $this->post('/staff/login', [
            'username' => 'inactive_staff',
            'password' => 'password123',
        ]);

        $response->assertSessionHasErrors('username');
        $this->assertGuest();
    }

    /**
     * Test staff cannot access admin routes
     */
    public function test_staff_cannot_access_admin_routes(): void
    {
        $staff = User::where('username', 'staff_test')->first();

        $response = $this->actingAs($staff)->get('/admin/overview');
        $response->assertStatus(403);
    }

    /**
     * Test admin cannot access staff routes with staff role check
     */
    public function test_admin_cannot_access_staff_routes(): void
    {
        $admin = User::where('username', 'admin_test')->first();

        $response = $this->actingAs($admin)->get('/staff/dashboard');
        $response->assertStatus(403);
    }

    /**
     * Test unauthenticated user cannot access staff dashboard
     */
    public function test_unauthenticated_user_cannot_access_staff_dashboard(): void
    {
        $response = $this->get('/staff/dashboard');
        $response->assertRedirect('/staff/login');
    }

    /**
     * Test unauthenticated user cannot access admin overview
     */
    public function test_unauthenticated_user_cannot_access_admin_overview(): void
    {
        $response = $this->get('/admin/overview');
        $response->assertRedirect('/admin/login');
    }

    /**
     * Test staff can logout
     */
    public function test_staff_can_logout(): void
    {
        $staff = User::where('username', 'staff_test')->first();

        $response = $this->actingAs($staff)->post('/staff/logout');
        $response->assertRedirect('/staff/login');
        $this->assertGuest();
    }

    /**
     * Test admin can logout
     */
    public function test_admin_can_logout(): void
    {
        $admin = User::where('username', 'admin_test')->first();

        $response = $this->actingAs($admin)->post('/admin/logout');
        $response->assertRedirect('/admin/login');
        $this->assertGuest();
    }

    /**
     * Test authenticated staff is redirected from login page
     */
    public function test_authenticated_staff_is_redirected_from_login_page(): void
    {
        $staff = User::where('username', 'staff_test')->first();

        $response = $this->actingAs($staff)->get('/staff/login');
        $response->assertRedirect('/staff/dashboard');
    }

    /**
     * Test authenticated admin is redirected from login page
     */
    public function test_authenticated_admin_is_redirected_from_login_page(): void
    {
        $admin = User::where('username', 'admin_test')->first();

        $response = $this->actingAs($admin)->get('/admin/login');
        $response->assertRedirect('/admin/overview');
    }
}
