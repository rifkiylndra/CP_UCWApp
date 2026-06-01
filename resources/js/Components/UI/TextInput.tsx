import React from 'react';

export interface TextInputProps {
    label?: string;
    placeholder?: string;
    value: string | number;
    onChange: (value: string) => void;
    error?: string;
    type?: 'text' | 'password' | 'email' | 'number';
    required?: boolean;
    name?: string;
}

export default function TextInput({
    label,
    placeholder,
    value,
    onChange,
    error,
    type = 'text',
    required = false,
    name
}: TextInputProps) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-[12px] font-bold tracking-wide" style={{ color: '#8B7B6B' }}>
                    {label} {required && <span style={{ color: '#FF5252' }}>*</span>}
                </label>
            )}
            
            <input
                type={type}
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                className={`
                    w-full px-4 py-3 rounded-xl text-[14px] font-medium outline-none transition-all
                    focus:ring-2 focus:ring-[#2D1A0E]/10
                    placeholder:text-gray-400
                `}
                style={{ 
                    backgroundColor: '#FFFFFF',
                    border: `1.5px solid ${error ? '#FF5252' : '#E8E2DB'}`,
                    borderColor: error ? '#FF5252' : undefined,
                    color: '#1A1208'
                }}
            />
            
            {error && (
                <span className="text-[11px] font-bold mt-0.5" style={{ color: '#FF5252' }}>
                    {error}
                </span>
            )}
        </div>
    );
}
