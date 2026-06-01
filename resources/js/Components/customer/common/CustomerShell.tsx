import { ReactNode } from 'react';

interface CustomerShellProps {
    children: ReactNode;
    mobileMaxWidth?: boolean;
    className?: string;
}

export default function CustomerShell({
    children,
    mobileMaxWidth = true,
    className = '',
}: CustomerShellProps) {
    return (
        <div
            className={`
                min-h-svh w-full
                ${mobileMaxWidth ? 'max-w-[480px] mx-auto md:max-w-none' : ''}
                ${className}
            `}
        >
            {children}
        </div>
    );
}