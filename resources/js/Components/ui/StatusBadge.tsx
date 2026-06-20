import React from 'react';

export type BadgeStatus = 
    | 'paid' | 'unpaid' | 'completed' | 'processing' | 'pending' | 'refunded'
    | 'available' | 'unavailable'
    | 'satisfied' | 'neutral' | 'critical';

export interface StatusBadgeProps {
    status: BadgeStatus;
    size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    // Pemetaan warna berdasarkan tipe status
    const getColorClass = (status: BadgeStatus): string => {
        switch (status) {
            // Positif / Aktif (Green Accent)
            case 'paid':
            case 'completed':
            case 'available':
            case 'satisfied':
                return 'bg-[#E8F2E8] text-[#2E5A2E] border border-[#CDE3CD]';
            
            // Negatif / Alert (Red Alert)
            case 'unpaid':
            case 'refunded':
            case 'unavailable':
            case 'critical':
                return 'bg-[#FCE8E8] text-[#C0392B] border border-[#FAD1D1]';
            
            // Proses / Peringatan (Orange/Yellow)
            case 'processing':
                return 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]';
            
            // Neutral (Gray/Brownish)
            case 'pending':
            case 'neutral':
            default:
                return 'bg-[#F5F3F0] text-[#8B7B6B] border border-[#E8E2DB]';
        }
    };

    // Tentukan format string agar rapi (kapital semua dan tanpa underscore)
    const formatStatus = (s: string) => {
        return s.replace('_', ' ').toUpperCase();
    };

    // Pemetaan ukuran
    const sizeClass = size === 'sm' 
        ? 'px-2 py-0.5 text-[9px] rounded-[4px]' 
        : 'px-2.5 py-1 text-[10px] rounded-[6px]';

    return (
        <span 
            className={`inline-flex items-center justify-center font-bold uppercase tracking-widest ${sizeClass} ${getColorClass(status)}`}
        >
            {formatStatus(status)}
        </span>
    );
}
