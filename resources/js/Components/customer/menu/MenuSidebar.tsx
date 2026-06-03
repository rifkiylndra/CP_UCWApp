import type { MenuCategory } from '@/types/customer';

interface CategoryOption {
    key: MenuCategory | 'all';
    label: string;
}

interface Props {
    categories: CategoryOption[];
    activeCategory: MenuCategory | 'all';
    search: string;
    onSearchChange: (value: string) => void;
    onCategoryChange: (category: MenuCategory | 'all') => void;
}

export default function MenuSidebar({
    categories,
    activeCategory,
    search,
    onSearchChange,
    onCategoryChange,
}: Props) {
    return (
        <aside
            className="w-64 xl:w-72 shrink-0 sticky top-0 h-svh overflow-y-auto flex flex-col p-7"
            style={{
                background: 'var(--color-ucw-bg)',
                borderRight: '1px solid var(--color-ucw-border)',
            }}
        >
            <div className="flex items-center gap-2 mb-8">
                <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-ucw-dark)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                    <line x1="6" y1="1" x2="6" y2="4" />
                    <line x1="10" y1="1" x2="10" y2="4" />
                    <line x1="14" y1="1" x2="14" y2="4" />
                </svg>

                <span
                    className="font-bold text-xs tracking-[0.04em]"
                    style={{ color: 'var(--color-ucw-dark)' }}
                >
                    UNAND CO-WORKSPACE
                </span>
            </div>

            <h2
                className="font-black leading-[1.1] tracking-tight mb-1.5"
                style={{ fontSize: '22px', color: 'var(--color-ucw-dark)' }}
            >
                Crafted for<br />your focus.
            </h2>

            <p
                className="mb-5"
                style={{ fontSize: '12.5px', color: 'var(--color-ucw-text-muted)' }}
            >
                Curated selections to fuel your workflow.
            </p>

            <div
                className="flex items-center gap-2 px-3 rounded-xl mb-5"
                style={{
                    height: '40px',
                    backgroundColor: 'var(--color-ucw-border)',
                }}
            >
                <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-ucw-text-muted)"
                    strokeWidth="2"
                    strokeLinecap="round"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                </svg>

                <input
                    type="search"
                    placeholder="Find your blend..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="flex-1 bg-transparent outline-none min-w-0"
                    style={{
                        fontSize: '13px',
                        color: 'var(--color-ucw-text)',
                    }}
                />
            </div>

            <nav className="flex flex-col gap-1">
                {categories.map((cat) => (
                    <button
                        key={cat.key}
                        onClick={() => onCategoryChange(cat.key)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all duration-150"
                        style={
                            activeCategory === cat.key
                                ? {
                                      backgroundColor: 'var(--color-ucw-dark)',
                                      color: 'white',
                                  }
                                : {
                                      color: 'var(--color-ucw-text-muted)',
                                      backgroundColor: 'transparent',
                                  }
                        }
                    >
                        {cat.label}
                    </button>
                ))}
            </nav>

            <div className="flex-1" />

            

            <p
                className="tracking-[0.2em] uppercase mt-6"
                style={{
                    fontFamily: 'monospace',
                    fontSize: '8px',
                    color: 'var(--color-ucw-border-dark)',
                }}
            >
                SCAN · ORDER · FOCUS · CREATE
            </p>
        </aside>
    );
}
