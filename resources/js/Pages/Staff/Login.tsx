import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function StaffLogin() {
    const { data, setData, post, errors, processing } = useForm({
        username: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('staff.login.post'));
    };

    return (
        <>
            <Head title="Staff Login" />
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">UCW Staff</h1>
                        <p className="text-slate-400">Unand Co-Workspace Management</p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                                    placeholder="Enter your username"
                                    disabled={processing}
                                />
                                {errors.username && (
                                    <p className="mt-1 text-sm text-red-400">{errors.username}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                                    placeholder="Enter your password"
                                    disabled={processing}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-600 text-white font-semibold rounded-lg transition duration-200 active:scale-95"
                            >
                                {processing ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        {/* Demo Credentials */}
                        <div className="mt-6 pt-6 border-t border-slate-700">
                            <p className="text-xs text-slate-400 mb-2">Demo Credentials:</p>
                            <div className="space-y-1 text-xs text-slate-500">
                                <p>Username: <span className="text-slate-300">staff1</span></p>
                                <p>Password: <span className="text-slate-300">password123</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
