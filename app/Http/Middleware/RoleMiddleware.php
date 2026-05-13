<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            // Redirect to appropriate login page based on role
            if ($role === 'staff') {
                return redirect()->route('staff.login');
            } elseif ($role === 'admin') {
                return redirect()->route('admin.login');
            }
            return redirect()->route('staff.login');
        }

        // Check if user has the required role
        if (auth()->user()->role !== $role) {
            abort(403, 'Unauthorized access');
        }

        return $next($request);
    }
}

