import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import Spinner from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
export type ButtonSize    = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?:   ButtonVariant;
    size?:      ButtonSize;
    loading?:   boolean;
    fullWidth?: boolean;
    leftIcon?:  ReactNode;
    rightIcon?: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
    primary:   'bg-ucw-dark text-white hover:bg-ucw-dark-hover active:scale-[0.98]',
    secondary: 'bg-ucw-bg-warm text-ucw-text hover:bg-ucw-border active:scale-[0.98]',
    ghost:     'bg-transparent text-ucw-medium hover:bg-ucw-bg-warm active:scale-[0.98]',
    outline:   'bg-transparent border border-ucw-border-dark text-ucw-text hover:bg-ucw-bg-warm active:scale-[0.98]',
    danger:    'bg-ucw-red text-white hover:opacity-90 active:scale-[0.98]',
};

const sizes: Record<ButtonSize, string> = {
    sm: 'h-9 px-4 text-sm rounded-[--radius-ucw-btn] gap-1.5',
    md: 'h-11 px-5 text-sm rounded-[--radius-ucw-btn] gap-2',
    lg: 'h-13 px-6 text-base font-semibold rounded-[--radius-ucw-card] gap-2',
};

export default function Button({
    variant   = 'primary',
    size      = 'md',
    loading   = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    children,
    className,
    disabled,
    ...props
}: ButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <button
            disabled={isDisabled}
            className={cn(
                'inline-flex items-center justify-center font-medium',
                'transition-all duration-150 select-none',
                variants[variant],
                sizes[size],
                isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                fullWidth  && 'w-full',
                className,
            )}
            {...props}
        >
            {loading ? (
                <Spinner size={size === 'sm' ? 'sm' : 'md'} color="current" />
            ) : (
                <>
                    {leftIcon  && <span className="shrink-0">{leftIcon}</span>}
                    <span>{children}</span>
                    {rightIcon && <span className="shrink-0">{rightIcon}</span>}
                </>
            )}
        </button>
    );
}