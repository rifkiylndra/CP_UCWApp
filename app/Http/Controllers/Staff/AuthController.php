<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show staff login page
     */
    public function showLogin()
    {
        // Redirect if already authenticated
        if (Auth::check() && Auth::user()->isStaff()) {
            return redirect()->route('staff.dashboard');
        }

        return Inertia::render('Staff/Login');
    }

    /**
     * Handle staff login
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

            // Check if user is staff and active
            if (!$user->isStaff() || !$user->isActive()) {
                Auth::logout();
                return back()->withErrors(['username' => 'Invalid credentials or account inactive']);
            }

            $request->session()->regenerate();

            return redirect()->intended(route('staff.dashboard'));
        }

        return back()->withErrors(['username' => 'Invalid credentials']);
    }

    /**
     * Handle staff logout
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('staff.login');
    }
}
