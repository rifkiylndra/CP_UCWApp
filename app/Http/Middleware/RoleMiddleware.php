<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $user = auth()->user();

        if ($role === 'admin' && !$user->isAdmin()) {
            abort(403, 'Akses ditolak. Hanya admin yang boleh masuk.');
        }

        if ($role === 'staff' && !$user->isStaff() && !$user->isAdmin()) {
            abort(403, 'Akses ditolak. Hanya staff yang boleh masuk.');
        }

        return $next($request);
    }
}