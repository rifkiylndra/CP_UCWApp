import { cn } from '@/lib/cn';
import type { OrderStatus } from '@/types/customer';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'pending' | 'preparing' | 'ready' | 'cancelled';

interface BadgeProps {
    variant?:   BadgeVariant;
    dot?:       boolean;
    children:   React.ReactNode;
    className?: string;
}

const variants: Record<BadgeVariant, string> = {
    default:   'bg-ucw-border text-ucw-text-muted',
    success:   'bg-ucw-green-bg text-ucw-green-text',
    warning:   'bg-ucw-amber-bg text-amber-700',
    error:     'bg-ucw-red-bg text-ucw-red-text',
    pending:   'bg-ucw-amber-bg text-amber-700',
    preparing: 'bg-orange-50 text-orange-600',
    ready:     'bg-ucw-green-bg text-ucw-green-text',
    cancelled: 'bg-ucw-red-bg text-ucw-red-text',
};

const dots: Record<BadgeVariant, string> = {
    default:   'bg-ucw-text-muted',
    success:   'bg-ucw-green',
    warning:   'bg-ucw-amber',
    error:     'bg-ucw-red',
    pending:   'bg-ucw-amber',
    preparing: 'bg-orange-500',
    ready:     'bg-ucw-green',
    cancelled: 'bg-ucw-red',
};

export default function Badge({ variant = 'default', dot = false, children, className }: BadgeProps) {
    return (
        <span className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
            variants[variant],
            className,
        )}>
            {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dots[variant])} />}
            {children}
        </span>
    );
}

export function orderStatusVariant(status: OrderStatus): BadgeVariant {
    const map: Record<OrderStatus, BadgeVariant> = {
        pending:   'pending',
        confirmed: 'default',
        preparing: 'preparing',
        ready:     'ready',
        completed: 'success',
        cancelled: 'cancelled',
    };
    return map[status] ?? 'default';
}

export function orderStatusLabel(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
        pending:   'Menunggu',
        confirmed: 'Dikonfirmasi',
        preparing: 'Sedang Diproses',
        ready:     'Siap Diambil',
        completed: 'Selesai',
        cancelled: 'Dibatalkan',
    };
    return map[status] ?? status;
}