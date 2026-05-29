import { ReactNode } from 'react';

interface CustomerLayoutProps {
    children: ReactNode;
    hideTopBar?: boolean;
}

export default function CustomerLayout({
    children,
}: CustomerLayoutProps) {
    return (
        <div
            className="min-h-svh w-full"
            style={{ backgroundColor: 'var(--color-ucw-bg)' }}
        >
            <main className="min-h-svh w-full">
                {children}
            </main>
        </div>
    );
}