import React from 'react';

export interface SelectInputProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    error?: string;
    required?: boolean;
    name?: string;
}

export default function SelectInput({
    label,
    value,
    onChange,
    options,
    error,
    required = false,
    name
}: SelectInputProps) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-[12px] font-bold tracking-wide" style={{ color: '#8B7B6B' }}>
                    {label} {required && <span style={{ color: '#FF5252' }}>*</span>}
                </label>
            )}
            
            <div className="relative">
                <select
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                    className={`
                        w-full pl-4 pr-10 py-3 rounded-xl text-[14px] font-medium outline-none transition-all appearance-none cursor-pointer
                        focus:ring-2 focus:ring-[#2D1A0E]/10
                    `}
                    style={{ 
                        backgroundColor: '#FFFFFF',
                        border: `1.5px solid ${error ? '#FF5252' : '#E8E2DB'}`,
                        color: value === '' ? '#8B7B6B' : '#1A1208'
                    }}
                >
                    <option value="" disabled hidden>
                        Select an option...
                    </option>
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                
                {/* ── Custom Dropdown Chevron ── */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
            </div>
            
            {error && (
                <span className="text-[11px] font-bold mt-0.5" style={{ color: '#FF5252' }}>
                    {error}
                </span>
            )}
        </div>
    );
}
