import React from 'react';

export interface StatCardProps {
    icon?: React.ReactNode;
    label: string;
    value: string | number;
    change?: string;
    changeType?: 'up' | 'down' | 'neutral';
    badge?: string;
    badgeColor?: string; // Tailwind classes, default provided
}

export default function StatCard({
    icon,
    label,
    value,
    change,
    changeType = 'neutral',
    badge,
    badgeColor = 'bg-[#F5F3F0] text-[#8B7B6B]' // Default styling
}: StatCardProps) {
    return (
        <div className="bg-white rounded-[20px] p-6 border shadow-sm flex flex-col justify-between"
             style={{ borderColor: '#E8E2DB' }}>
            
            {/* ── Header: Icon, Label, Badge ── */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    {icon && (
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#F5F3F0] text-[#2D1A0E]">
                            {icon}
                        </div>
                    )}
                    <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#8B7B6B]">
                        {label}
                    </h3>
                </div>
                {badge && (
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md ${badgeColor}`}>
                        {badge}
                    </span>
                )}
            </div>

            {/* ── Value & Change ── */}
            <div className="flex items-end justify-between mt-2">
                <h2 className="text-[32px] font-black leading-none text-[#1A1208]">
                    {value}
                </h2>
                
                {change && (
                    <div className={`flex items-center gap-1 text-[13px] font-bold mb-1 ${
                        changeType === 'up' ? 'text-[#4CAF50]' : 
                        changeType === 'down' ? 'text-[#FF5252]' : 
                        'text-[#8B7B6B]'
                    }`}>
                        {changeType === 'up' && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                                <polyline points="16 7 22 7 22 13"></polyline>
                            </svg>
                        )}
                        {changeType === 'down' && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline>
                                <polyline points="16 17 22 17 22 11"></polyline>
                            </svg>
                        )}
                        <span>{change}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
