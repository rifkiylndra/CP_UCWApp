<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StaffAuthController extends Controller
{
    /**
     * Tampilkan halaman login untuk staff.
     */
    public function showLogin()
    {
        return Inertia::render('Staff/Login');
    }

    /**
     * Proses request login.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => ['required'],
            'password' => ['required'],
        ]);

        $remember = $request->boolean('remember');

        // Simulasi Auth untuk Phase 2 (Frontend)
        // Karena database belum di-seed, kita hardcode username dan password untuk testing UI.
        if ($credentials['username'] === 'staff' && $credentials['password'] === 'password') {
            // Jika berhasil, langsung redirect ke dashboard (Auth session diloncati dulu)
            return redirect()->intended(route('staff.dashboard'));
        }

        // Return back dengan error sekaligus memberitahu kredensial yang benar
        return back()->withErrors([
            'username' => 'Gunakan Username: staff dan Password: password untuk testing.',
        ])->onlyInput('username');
    }

    /**
     * Proses logout staff.
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('staff.login');
    }
}
