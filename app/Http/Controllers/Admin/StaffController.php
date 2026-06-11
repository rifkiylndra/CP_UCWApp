<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Exports\StaffExport;
use App\Http\Requests\Admin\StoreStaffRequest;
use App\Http\Requests\Admin\UpdateStaffRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class StaffController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->has('role') && in_array($request->role, ['admin', 'staff'])) {
            $query->where('role', $request->role);
        } else {
            $query->whereIn('role', ['admin', 'staff']);
        }

        $staff = $query->orderBy('created_at', 'desc')->paginate(10);
            
        return Inertia::render('Admin/Staff/Index', [
            'staffs' => $staff,
            'filters' => $request->only(['role'])
        ]);
    }

    public function store(StoreStaffRequest $request)
    {
        $validated = $request->validated();

        User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Staff created successfully');
    }

    public function update(UpdateStaffRequest $request, User $staff)
    {
        // Cegah menghapus/edit diri sendiri (optional) atau biarkan saja
        $validated = $request->validated();

        $updateData = [
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'role' => $validated['role'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $staff->update($updateData);

        return redirect()->back()->with('success', 'Staff updated successfully');
    }

    public function destroy(User $staff)
    {
        // Mencegah admin menghapus dirinya sendiri jika dibutuhkan,
        // tapi untuk saat ini izinkan saja.
        if (auth()->id() === $staff->id) {
            return redirect()->back()->withErrors(['error' => 'You cannot delete yourself.']);
        }

        $staff->delete();

        return redirect()->back()->with('success', 'Staff deleted successfully');
    }

    public function export(Request $request)
    {
        $role = $request->input('role');

        return Excel::download(
            new StaffExport($role),
            'staff-list.xlsx'
        );
    }
}
