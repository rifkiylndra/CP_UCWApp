import { ReactNode } from 'react';

interface StatCardProps {
    label: string;
    value: string | number;
    change?: string;
    changeType?: 'up' | 'down';
    badge?: string;
    badgeColor?: string;
    icon?: ReactNode;
}

export default function StatCard({
    label,
    value,
    change,
    changeType = 'up',
    badge,
    badgeColor = 'bg-blue-100 text-blue-800',
    icon,
}: StatCardProps) {
    return (
        <div className="bg-white rounded-[24px] p-8 border shadow-sm" style={{ borderColor: '#E8E2DB' }}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-[12px] font-bold uppercase tracking-widest text-[#8B7B6B] mb-2">
                        {label}
                    </p>
                    <h3 className="text-[32px] font-black text-[#1A1208]">
                        {value}
                    </h3>
                </div>
                {icon && (
                    <div className="text-[#C8A96E]">
                        {icon}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between">
                {change && (
                    <p className={`text-[13px] font-bold ${changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {changeType === 'up' ? '↑' : '↓'} {change}
                    </p>
                )}
                {badge && (
                    <span className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${badgeColor}`}>
                        {badge}
                    </span>
                )}
            </div>
        </div>
    );
}
