export default function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
            <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-ucw-border-dark)"
                strokeWidth="1.5"
            >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>

            <p style={{ color: 'var(--color-ucw-text-muted)', fontSize: '14px' }}>
                No items found
            </p>
        </div>
    );
}