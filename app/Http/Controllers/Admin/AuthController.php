<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show admin login page
     */
    public function showLogin()
    {
        // Redirect if already authenticated
        if (Auth::check() && Auth::user()->isAdmin()) {
            return redirect()->route('admin.overview');
        }

        return Inertia::render('Admin/Login');
    }

    /**
     * Handle admin login
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // Attempt to authenticate
        if (Auth::attempt(['username' => $credentials['username'], 'password' => $credentials['password']])) {
            $user = Auth::user();

            // Check if user is admin and active
            if (!$user->isAdmin() || !$user->isActive()) {
                Auth::logout();
                return back()->withErrors(['username' => 'Invalid credentials or account inactive']);
            }

            $request->session()->regenerate();

            return redirect()->intended(route('admin.overview'));
        }

        return back()->withErrors(['username' => 'Invalid credentials']);
    }

    /**
     * Handle admin logout
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
