import React, { useState, FormEvent, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import TextInput from '@/Components/UI/TextInput';
import SelectInput from '@/Components/UI/SelectInput';

interface StaffMember {
    id: string;
    userId: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    registeredAt: string;
    isActive: boolean;
    username?: string;
}

interface AddStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    staffToEdit?: StaffMember | null;
}

export default function AddStaffModal({ isOpen, onClose, staffToEdit }: AddStaffModalProps) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        username: '',
        role: '',
        password: '',
    });

    useEffect(() => {
        if (isOpen) {
            if (staffToEdit) {
                setData({
                    name: staffToEdit.name,
                    username: staffToEdit.username || staffToEdit.email.split('@')[0], // Fallback username
                    role: staffToEdit.role,
                    password: '', // Kosongkan password saat edit
                });
            } else {
                reset();
            }
            setShowPassword(false);
        }
    }, [isOpen, staffToEdit]);

    if (!isOpen) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        // Pengecekan route fallback aman via window.route (ziggy)
        try {
            if (staffToEdit) {
                const updateRoute = route('admin.staff.update' as any, staffToEdit.id as any);
                put(updateRoute, {
                    onSuccess: () => onClose(),
                });
            } else {
                const storeRoute = route('admin.staff.store' as any);
                post(storeRoute, {
                    onSuccess: () => onClose(),
                });
            }
        } catch (err) {
            console.warn("Routes are not fully registered yet. Closing modal as dummy action.");
            onClose(); // Dummy close jika route belum ada
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-[#1A1208]/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-[480px] bg-[#F5F3F0] rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* ── Header ── */}
                <div className="px-8 py-6 bg-white border-b flex justify-between items-center" style={{ borderColor: '#E8E2DB' }}>
                    <div>
                        <h2 className="text-[20px] font-black tracking-tight text-[#1A1208]">
                            {staffToEdit ? 'Edit Staff Member' : 'Register New Staff'}
                        </h2>
                        <p className="text-[12px] font-bold tracking-widest uppercase text-[#8B7B6B] mt-1">
                            {staffToEdit ? 'Update Details' : 'Account Details'}
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-[#F5F3F0] hover:bg-[#E8E2DB] flex items-center justify-center text-[#1A1208] transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                {/* ── Body Form ── */}
                <div className="p-8 overflow-y-auto styled-scrollbar">
                    
                    {/* Avatar Upload Placeholder */}
                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="relative group cursor-pointer">
                            <div className="w-24 h-24 rounded-full bg-white border-2 border-dashed border-[#E8E2DB] flex items-center justify-center overflow-hidden group-hover:border-[#C8A96E] transition-colors">
                                {staffToEdit?.avatar ? (
                                    <img src={staffToEdit.avatar} alt="Avatar" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#8B7B6B] group-hover:text-[#C8A96E] transition-colors"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                )}
                            </div>
                            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-[10px] font-bold uppercase tracking-wider">Upload</span>
                            </div>
                        </div>
                    </div>

                    <form id="addStaffForm" onSubmit={handleSubmit} className="flex flex-col gap-5">
                        
                        <TextInput 
                            label="Full Name"
                            placeholder="e.g. Julian Thorne"
                            value={data.name}
                            onChange={(val) => setData('name', val)}
                            error={errors.name}
                            required
                        />

                        <TextInput 
                            label="Username"
                            placeholder="e.g. julian_t"
                            value={data.username}
                            onChange={(val) => setData('username', val)}
                            error={errors.username}
                            required
                        />

                        <SelectInput 
                            label="Role Assignment"
                            value={data.role}
                            onChange={(val) => setData('role', val)}
                            error={errors.role}
                            required
                            options={[
                                { value: 'Head Barista', label: 'Head Barista' },
                                { value: 'Barista', label: 'Barista' },
                                { value: 'Cashier', label: 'Cashier' },
                                { value: 'Manager', label: 'Manager' },
                            ]}
                        />

                        <div className="relative">
                            <TextInput 
                                label={staffToEdit ? "New Password (Leave blank to keep current)" : "Password"}
                                placeholder="Min. 8 characters"
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                onChange={(val) => setData('password', val)}
                                error={errors.password}
                                required={!staffToEdit}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-[38px] text-[12px] font-bold text-[#8B7B6B] hover:text-[#1A1208] transition-colors"
                            >
                                {showPassword ? 'HIDE' : 'SHOW'}
                            </button>
                        </div>

                    </form>
                </div>

                {/* ── Footer ── */}
                <div className="px-8 py-5 bg-white border-t flex items-center justify-end gap-3" style={{ borderColor: '#E8E2DB' }}>
                    <button 
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl text-[13px] font-bold text-[#1A1208] hover:bg-[#F5F3F0] transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        form="addStaffForm"
                        disabled={processing}
                        className="px-8 py-3 rounded-xl bg-[#2D1A0E] text-white text-[13px] font-bold tracking-wide hover:bg-black transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-md shadow-[#2D1A0E]/20"
                    >
                        {processing ? 'Saving...' : (staffToEdit ? 'Save Changes' : 'Save Staff')}
                        {!processing && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>}
                    </button>
                </div>

            </div>
        </div>
    );
}
