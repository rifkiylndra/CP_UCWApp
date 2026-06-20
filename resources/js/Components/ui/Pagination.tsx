import React from 'react';

export interface PaginationProps {
    currentPage: number;
    totalItems: number;
    perPage: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalItems, perPage, onPageChange }: PaginationProps) {
    const totalPages = Math.ceil(totalItems / perPage);
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
    const endItem = Math.min(currentPage * perPage, totalItems);

    return (
        <div className="flex items-center justify-between py-5 border-t mt-4" style={{ borderColor: '#E8E2DB' }}>
            {/* ── Info Teks ── */}
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#8B7B6B' }}>
                Showing {startItem}-{endItem} of {totalItems}
            </span>

            {/* ── Navigasi ── */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="flex items-center justify-center px-3 py-2 rounded-lg text-[11px] font-bold tracking-widest uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F5F3F0] border"
                    style={{ color: '#1A1208', borderColor: '#E8E2DB' }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Prev
                </button>
                
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || totalItems === 0}
                    className="flex items-center justify-center px-3 py-2 rounded-lg text-[11px] font-bold tracking-widest uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F5F3F0] border"
                    style={{ color: '#1A1208', borderColor: '#E8E2DB' }}
                >
                    Next
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-1.5">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
        </div>
    );
}
