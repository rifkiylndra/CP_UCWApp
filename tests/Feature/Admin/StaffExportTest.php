<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class StaffExportTest extends TestCase
{
    use RefreshDatabase;

    protected function createAdmin(): User
    {
        return User::create([
            'name' => 'Admin User',
            'username' => 'adminuser',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
            'is_active' => true,
        ]);
    }

    public function test_admin_can_export_all_staff_and_admin_users(): void
    {
        $admin = $this->createAdmin();

        User::create([
            'name' => 'Staff One',
            'username' => 'staffone',
            'email' => 'staff1@example.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)
            ->get(route('admin.staff.export'));

        $response->assertOk();
        $response->assertHeader(
            'content-disposition',
            'attachment; filename=staff-list.xlsx'
        );
    }

    public function test_admin_can_export_filtered_role_users(): void
    {
        $admin = $this->createAdmin();

        User::create([
            'name' => 'Staff One',
            'username' => 'staffone',
            'email' => 'staff1@example.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Admin Two',
            'username' => 'admintwo',
            'email' => 'admin2@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)
            ->get(route('admin.staff.export', ['role' => 'staff']));

        $response->assertOk();
        $response->assertHeader(
            'content-disposition',
            'attachment; filename=staff-list.xlsx'
        );

        $this->assertStringContainsString(
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            (string) $response->headers->get('content-type')
        );
    }
}
