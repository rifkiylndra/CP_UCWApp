<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Admin UCW',
            'username' => 'admin',
            'email' => 'admin@ucw.app',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Staff
        User::create([
            'name' => 'Staff 1',
            'username' => 'staff1',
            'email' => 'staff1@ucw.app',
            'password' => Hash::make('password123'),
            'role' => 'staff',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Staff 2',
            'username' => 'staff2',
            'email' => 'staff2@ucw.app',
            'password' => Hash::make('password123'),
            'role' => 'staff',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Staff 3',
            'username' => 'staff3',
            'email' => 'staff3@ucw.app',
            'password' => Hash::make('password123'),
            'role' => 'staff',
            'is_active' => true,
        ]);
    }
}