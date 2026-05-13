<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class StaffController extends Controller
{
    /**
     * Display staff management page
     */
    public function index()
    {
        $staff = User::where('role', 'staff')->paginate(15);

        return Inertia::render('Admin/Staff', [
            'staff' => $staff,
        ]);
    }

    /**
     * Store new staff
     */
    public function store()
    {
        $validated = request()->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|unique:users|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'is_active' => 'boolean',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['role'] = 'staff';

        $staff = User::create($validated);

        return response()->json([
            'data' => $staff,
            'message' => 'Staff created successfully',
        ], 201);
    }

    /**
     * Update staff
     */
    public function update(User $staff)
    {
        $validated = request()->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $staff->id,
            'is_active' => 'boolean',
        ]);

        $staff->update($validated);

        return response()->json([
            'data' => $staff,
            'message' => 'Staff updated successfully',
        ]);
    }

    /**
     * Delete staff
     */
    public function destroy(User $staff)
    {
        $staff->delete();

        return response()->json(['message' => 'Staff deleted successfully']);
    }
}
