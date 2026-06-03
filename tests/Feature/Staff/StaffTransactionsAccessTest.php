<?php

namespace Tests\Feature\Staff;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class StaffTransactionsAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function createStaff(): User
    {
        return User::create([
            'name' => 'Staff User',
            'username' => 'staffuser',
            'email' => 'staff@example.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'is_active' => true,
        ]);
    }

    public function test_staff_can_access_transactions_page(): void
    {
        $staff = $this->createStaff();

        $this->actingAs($staff)
            ->get(route('staff.transactions'))
            ->assertOk();
    }

    public function test_guest_is_redirected_from_staff_transactions_page(): void
    {
        $this->get(route('staff.transactions'))
            ->assertRedirect(route('login'));
    }
}
