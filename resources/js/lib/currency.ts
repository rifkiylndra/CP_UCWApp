const IDR = new Intl.NumberFormat('id-ID', {
    style:                 'currency',
    currency:              'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

/** Rp 45.000 */
export function formatIDR(amount: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/** Rp 45K / Rp 1,2Jt */
export function formatIDRCompact(amount: number): string {
    if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1)}Jt`;
    if (amount >= 1_000)     return `Rp ${(amount / 1_000).toFixed(0)}K`;
    return `Rp ${amount}`;
}

