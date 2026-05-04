import React, { FormEvent, useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import TextInput from '@/Components/UI/TextInput';
import SelectInput from '@/Components/UI/SelectInput';
import ToggleSwitch from '@/Components/UI/ToggleSwitch';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface MenuItem {
    id: string;
    name: string;
    subtitle: string;
    description: string;
    price: number;
    imageUrl: string;
    isAvailable: boolean;
    category: string; // Saat submit mungkin butuh category_id, namun di sini kita mock
}

interface AddMenuModalProps {
    isOpen: boolean;
    onClose: () => void;
    menuToEdit?: MenuItem | null;
    categories?: Category[];
}

export default function AddMenuModal({ isOpen, onClose, menuToEdit, categories }: AddMenuModalProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        subtitle: '',
        category_id: '',
        price: '',
        description: '',
        isAvailable: true,
        image: null as File | null,
    });

    // Default categories fallback jika prop kosong
    const defaultCategories = categories || [
        { id: '1', name: 'Espresso', slug: 'espresso' },
        { id: '2', name: 'Milk Based', slug: 'milk-based' },
        { id: '3', name: 'Filter', slug: 'filter' },
        { id: '4', name: 'Fusion', slug: 'fusion' },
    ];

    useEffect(() => {
        if (isOpen) {
            if (menuToEdit) {
                setData({
                    name: menuToEdit.name,
                    subtitle: menuToEdit.subtitle || '',
                    category_id: menuToEdit.category, // Dummy mapping
                    price: menuToEdit.price.toString(),
                    description: menuToEdit.description || '',
                    isAvailable: menuToEdit.isAvailable,
                    image: null,
                });
                setImagePreview(menuToEdit.imageUrl);
            } else {
                reset();
                setImagePreview(null);
            }
        }
    }, [isOpen, menuToEdit]);

    if (!isOpen) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        try {
            if (menuToEdit) {
                // Di Laravel, file upload pada PUT butuh method spoofing, namun kita mock saja
                const updateRoute = route('admin.menu.update' as any, menuToEdit.id as any);
                post(updateRoute, { // Mock menggunakan post karena inertia file upload rules
                    data: { ...data, _method: 'put' },
                    onSuccess: () => onClose(),
                });
            } else {
                const storeRoute = route('admin.menu.store' as any);
                post(storeRoute, {
                    onSuccess: () => onClose(),
                });
            }
        } catch (err) {
            console.warn("Routes are not fully registered yet. Closing modal as dummy action.");
            onClose(); 
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-[#1A1208]/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content (Split Layout) */}
            <div className="relative w-full max-w-[850px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
                
                {/* ── KIRI: Upload Area ── */}
                <div className="w-full md:w-[35%] bg-[#F5F3F0] p-8 flex flex-col border-r border-[#E8E2DB] relative">
                    <button 
                        onClick={onClose}
                        className="md:hidden absolute top-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1A1208] shadow-sm z-10"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>

                    <div className="mb-6">
                        <h2 className="text-[20px] font-black tracking-tight text-[#1A1208]">Product Visual</h2>
                        <p className="text-[12px] font-medium text-[#8B7B6B] mt-1">Upload a high-quality image of the menu item.</p>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        <label className="relative w-full aspect-[4/5] rounded-[24px] border-2 border-dashed border-[#C8A96E] bg-white overflow-hidden cursor-pointer group flex flex-col items-center justify-center transition-all hover:bg-[#FDF8F3] hover:shadow-[0_0_20px_rgba(200,169,110,0.15)]">
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleImageChange}
                            />
                            
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                        <span className="text-white text-[11px] font-bold tracking-widest uppercase">Change Image</span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center text-center p-6">
                                    <div className="w-16 h-16 rounded-full bg-[#FDF8F3] flex items-center justify-center mb-4 text-[#C8A96E]">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                    </div>
                                    <span className="text-[13px] font-bold text-[#1A1208]">Click to upload</span>
                                    <span className="text-[11px] font-medium text-[#8B7B6B] mt-1">SVG, PNG, JPG or GIF (max. 2MB)</span>
                                </div>
                            )}
                        </label>
                    </div>

                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#E8E2DB] shadow-sm">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                            <span className="text-[10px] font-bold tracking-widest uppercase text-[#1A1208]">UCW Collection</span>
                        </div>
                    </div>
                </div>

                {/* ── KANAN: Form Fields ── */}
                <div className="w-full md:w-[65%] flex flex-col h-full max-h-[90vh]">
                    
                    <div className="hidden md:flex px-8 py-5 border-b border-[#E8E2DB] justify-between items-center bg-white z-10">
                        <h2 className="text-[18px] font-black tracking-tight text-[#1A1208]">
                            {menuToEdit ? 'Edit Item Details' : 'New Item Details'}
                        </h2>
                        <button 
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-[#F5F3F0] hover:bg-[#E8E2DB] flex items-center justify-center text-[#1A1208] transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    <div className="p-8 overflow-y-auto styled-scrollbar flex-1 bg-white">
                        <form id="addMenuForm" onSubmit={handleSubmit} className="flex flex-col gap-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <TextInput 
                                    label="Item Name"
                                    placeholder="e.g. Single Origin Espresso"
                                    value={data.name}
                                    onChange={(val) => setData('name', val)}
                                    error={errors.name}
                                    required
                                />
                                
                                <TextInput 
                                    label="Subtitle / Origin (Optional)"
                                    placeholder="e.g. Ethiopia Yirgacheffe"
                                    value={data.subtitle}
                                    onChange={(val) => setData('subtitle', val)}
                                    error={errors.subtitle}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SelectInput 
                                    label="Collection / Category"
                                    value={data.category_id}
                                    onChange={(val) => setData('category_id', val)}
                                    error={errors.category_id}
                                    required
                                    options={defaultCategories.map(c => ({ value: c.id, label: c.name }))}
                                />
                                
                                <TextInput 
                                    label="Price Point (IDR)"
                                    placeholder="e.g. 45000"
                                    type="number"
                                    value={data.price}
                                    onChange={(val) => setData('price', val)}
                                    error={errors.price}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[12px] font-bold tracking-wide text-[#8B7B6B]">Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Describe the flavor profile, ingredients, or story behind this item..."
                                    className={`w-full p-4 rounded-xl text-[14px] font-medium outline-none transition-all resize-none min-h-[100px] focus:ring-2 focus:ring-[#2D1A0E]/10 placeholder:text-gray-400`}
                                    style={{ 
                                        backgroundColor: '#FFFFFF',
                                        border: `1.5px solid ${errors.description ? '#FF5252' : '#E8E2DB'}`,
                                        color: '#1A1208'
                                    }}
                                />
                                {errors.description && <span className="text-[11px] font-bold mt-0.5 text-[#FF5252]">{errors.description}</span>}
                            </div>

                            <div className="flex items-center justify-between p-5 rounded-[16px] bg-[#F5F3F0] border border-[#E8E2DB] mt-2">
                                <div>
                                    <h4 className="text-[14px] font-bold text-[#1A1208] mb-0.5">Item Availability</h4>
                                    <p className="text-[12px] font-medium text-[#8B7B6B]">Turn off if ingredients are out of stock.</p>
                                </div>
                                <ToggleSwitch 
                                    checked={data.isAvailable}
                                    onChange={(checked) => setData('isAvailable', checked)}
                                    size="md"
                                />
                            </div>

                        </form>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-8 py-5 border-t border-[#E8E2DB] bg-white flex items-center justify-end gap-3 z-10">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl text-[13px] font-bold text-[#1A1208] hover:bg-[#F5F3F0] transition-colors border border-[#E8E2DB]"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            form="addMenuForm"
                            disabled={processing}
                            className="px-8 py-3 rounded-xl bg-[#2D1A0E] text-white text-[13px] font-bold tracking-wide hover:bg-black transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-md shadow-[#2D1A0E]/20"
                        >
                            {processing ? 'Saving...' : (menuToEdit ? 'Save Changes' : 'Save Menu')}
                            {!processing && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
