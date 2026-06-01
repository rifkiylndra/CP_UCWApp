<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class StaffController extends Controller
{
    public function index()
    {
        $staff = User::where('role', 'staff')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        return Inertia::render('Admin/Staff/Index', [
            'staffs' => $staff
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'staff',
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Staff created successfully');
    }

    public function update(Request $request, User $staff)
    {
        // Pastikan tidak merubah admin via endpoint ini
        if ($staff->role !== 'staff') {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => ['required', 'string', 'max:255', Rule::unique('users')->ignore($staff->id)],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($staff->id)],
            'password' => 'nullable|string|min:8',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $staff->update($updateData);

        return redirect()->back()->with('success', 'Staff updated successfully');
    }

    public function destroy(User $staff)
    {
        // Hanya bisa menghapus staff
        if ($staff->role !== 'staff') {
            abort(403);
        }

        $staff->delete();

        return redirect()->back()->with('success', 'Staff deleted successfully');
    }
}
