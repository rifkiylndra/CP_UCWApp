import { cn } from '@/lib/cn';

interface SpinnerProps {
    size?:      'sm' | 'md' | 'lg';
    color?:     'dark' | 'light' | 'current';
    className?: string;
}

const sizes  = { sm: 'w-3.5 h-3.5 border-[1.5px]', md: 'w-5 h-5 border-2', lg: 'w-7 h-7 border-2' };
const colors = {
    dark:    'border-ucw-dark/20 border-t-ucw-dark',
    light:   'border-white/30 border-t-white',
    current: 'border-current/20 border-t-current',
};

export default function Spinner({ size = 'md', color = 'dark', className }: SpinnerProps) {
    return (
        <span
            role="status"
            aria-label="Loading"
            className={cn('inline-block rounded-full animate-spin', sizes[size], colors[color], className)}
        />
    );
}