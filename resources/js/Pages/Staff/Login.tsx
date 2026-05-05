import { FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function StaffLogin() {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        remember: false as boolean,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('staff.login'));
    };

    return (
        <>
            <Head title="Staff POS Login" />
            
            {/* ── Background & Layout ── */}
            <div className="min-h-screen flex items-center justify-center p-5"
                style={{ backgroundColor: 'var(--color-ucw-bg)' }}>
                
                {/* ── Login Card ── */}
                <div className="w-full max-w-[420px] bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                    style={{ border: '1px solid var(--color-ucw-border)' }}>
                    
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                            style={{ backgroundColor: 'var(--color-ucw-dark)' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                                <line x1="6" y1="1" x2="6" y2="4"></line>
                                <line x1="10" y1="1" x2="10" y2="4"></line>
                                <line x1="14" y1="1" x2="14" y2="4"></line>
                            </svg>
                        </div>
                        <h1 className="text-[22px] font-black tracking-tight text-center" style={{ color: 'var(--color-ucw-text)' }}>
                            UNAND Co-Workspace
                        </h1>
                        <p className="text-[13px] mt-1 font-medium tracking-wide uppercase" style={{ color: 'var(--color-ucw-text-muted)' }}>
                            POS / System Access
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className="flex flex-col gap-5">
                        
                        {/* Username Field */}
                        <div>
                            <label className="block text-[13px] font-bold mb-2" style={{ color: 'var(--color-ucw-text)' }}>
                                Username / ID
                            </label>
                            <input
                                type="text"
                                value={data.username}
                                onChange={e => setData('username', e.target.value)}
                                placeholder="Enter your staff ID"
                                className="w-full px-4 py-3.5 rounded-xl text-[14px] outline-none transition-all duration-200"
                                style={{ 
                                    backgroundColor: 'var(--color-ucw-bg)',
                                    border: `1.5px solid ${errors.username ? 'var(--color-ucw-red)' : 'var(--color-ucw-border)'}`,
                                    color: 'var(--color-ucw-text)'
                                }}
                            />
                            {errors.username && (
                                <p className="text-[12px] font-medium mt-1.5" style={{ color: 'var(--color-ucw-red)' }}>
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-[13px] font-bold mb-2" style={{ color: 'var(--color-ucw-text)' }}>
                                Access PIN / Password
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3.5 rounded-xl text-[14px] outline-none transition-all duration-200"
                                style={{ 
                                    backgroundColor: 'var(--color-ucw-bg)',
                                    border: `1.5px solid ${errors.password ? 'var(--color-ucw-red)' : 'var(--color-ucw-border)'}`,
                                    color: 'var(--color-ucw-text)'
                                }}
                            />
                            {errors.password && (
                                <p className="text-[12px] font-medium mt-1.5" style={{ color: 'var(--color-ucw-red)' }}>
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Link */}
                        <div className="flex items-center justify-between mt-1 mb-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="w-4 h-4 rounded border flex items-center justify-center transition-colors"
                                    style={{ 
                                        backgroundColor: data.remember ? 'var(--color-ucw-dark)' : 'transparent',
                                        borderColor: data.remember ? 'var(--color-ucw-dark)' : 'var(--color-ucw-border-dark)'
                                    }}>
                                    {data.remember && (
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    )}
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="hidden"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                />
                                <span className="text-[13px] font-medium select-none" style={{ color: 'var(--color-ucw-text-muted)' }}>
                                    Remember me
                                </span>
                            </label>

                            <button type="button" className="text-[13px] font-bold hover:underline" style={{ color: 'var(--color-ucw-dark)' }}>
                                Forgot Access?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 rounded-xl text-[15px] font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            style={{ backgroundColor: 'var(--color-ucw-dark)' }}
                        >
                            {processing ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Login to System
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                    
                </div>
            </div>
        </>
    );
}
