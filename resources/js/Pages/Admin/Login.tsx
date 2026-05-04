import React, { FormEvent } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import TextInput from '@/Components/UI/TextInput';

export default function AdminLogin() {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        remember: false as boolean,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        let postRoute = '#';
        try {
            postRoute = route('admin.login.post' as any);
        } catch (err) {}
        post(postRoute);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F3F0] p-6 text-[#1A1208]">
            <Head title="Admin Login — UCW" />

            {/* ── Main Card Wrapper ── */}
            <div className="bg-white rounded-[32px] shadow-2xl flex overflow-hidden w-full max-w-[800px]"
                 style={{ border: '1px solid #E8E2DB' }}>
                
                {/* ── KIRI: Form Login ── */}
                <div className="flex-1 flex flex-col p-10 lg:p-12">
                    
                    {/* Brand */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-[#2D1A0E] flex items-center justify-center text-white font-black text-lg shadow-sm">
                            UC
                        </div>
                        <div className="leading-tight">
                            <h1 className="text-[#1A1208] text-[16px] font-black tracking-tight">UNAND</h1>
                            <p className="text-[#8B7B6B] text-[10px] uppercase font-bold tracking-widest mt-0.5">Co-Workspace</p>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="mb-8">
                        <h2 className="text-[32px] font-black tracking-tight mb-2">Admin Portal</h2>
                        <p className="text-[#8B7B6B] text-[14px] font-medium leading-relaxed">
                            System access is restricted to authorized personnel.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className="flex flex-col gap-5 flex-1">
                        <TextInput
                            label="Username"
                            name="username"
                            value={data.username}
                            onChange={(val) => setData('username', val as string)}
                            placeholder="e.g. admin_budi"
                            error={errors.username}
                            required
                        />

                        <TextInput
                            label="Password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(val) => setData('password', val as string)}
                            placeholder="••••••••"
                            error={errors.password}
                            required
                        />

                        <div className="flex items-center justify-between mt-1 mb-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded transition-all cursor-pointer accent-[#2D1A0E]"
                                />
                                <span className="text-[12px] font-bold text-[#8B7B6B] group-hover:text-[#1A1208] transition-colors">
                                    Remember me
                                </span>
                            </label>

                            <Link href="#" className="text-[12px] font-bold text-[#8B7B6B] hover:text-[#2D1A0E] transition-colors underline decoration-transparent hover:decoration-[#2D1A0E]">
                                Forgot Access?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full mt-2 py-4 rounded-[16px] text-white font-bold text-[15px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black"
                            style={{ backgroundColor: '#2D1A0E' }}
                        >
                            Login Access
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </button>
                    </form>

                    {/* Footer Kiri */}
                    <div className="mt-12 pt-6 border-t flex items-center justify-between text-[11px] font-bold text-[#8B7B6B]" style={{ borderColor: '#E8E2DB' }}>
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-[#1A1208] transition-colors">EN / ID</Link>
                            <Link href="#" className="hover:text-[#1A1208] transition-colors">Support</Link>
                        </div>
                        <span>© 2026 UCW</span>
                    </div>

                </div>

                {/* ── KANAN: Editorial Image (256px) ── */}
                <div className="hidden md:block w-[256px] bg-[#2D1A0E] relative overflow-hidden flex-shrink-0">
                    <img 
                        src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600&auto=format&fit=crop" 
                        alt="Coffee Roasting" 
                        className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal hover:scale-105 transition-all duration-[2000ms]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1208] via-transparent to-[#1A1208]/30"></div>
                    
                    <div className="absolute bottom-10 left-8 right-8">
                        <p className="text-white text-[12px] font-bold uppercase tracking-widest mb-2 opacity-80">
                            Command Center
                        </p>
                        <h3 className="text-white text-[24px] font-black leading-tight tracking-tight">
                            Operations<br/>Control
                        </h3>
                    </div>
                </div>

            </div>
        </div>
    );
}
