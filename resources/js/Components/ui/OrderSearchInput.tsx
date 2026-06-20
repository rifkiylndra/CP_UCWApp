import { Search, X } from "lucide-react";

interface OrderSearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    resultCount?: number;
    totalCount?: number;
}

export default function OrderSearchInput({
    value,
    onChange,
    placeholder = "Search order ref, table, customer, menu",
    resultCount,
    totalCount,
}: OrderSearchInputProps) {
    const hasValue = value.trim().length > 0;

    return (
        <div className="flex w-full flex-col gap-2 sm:max-w-[460px]">
            <label className="relative block">
                <Search
                    size={17}
                    strokeWidth={2.2}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7B77]"
                />

                <input
                    type="search"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    className="h-12 w-full rounded-full border border-[#ECE8E4] bg-white pl-11 pr-11 text-[13px] font-semibold text-[#271310] shadow-[0_10px_24px_rgba(39,19,16,0.03)] outline-none placeholder:text-[#A69D9A] focus:border-[#D8C0A0] focus:ring-2 focus:ring-[#C8A96E]/20 lg:h-11 lg:text-[14px]"
                />

                {hasValue && (
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#8A7B77] transition hover:bg-[#F4F4F3] hover:text-[#271310]"
                        aria-label="Clear order search"
                    >
                        <X size={15} />
                    </button>
                )}
            </label>

            {typeof resultCount === "number" && typeof totalCount === "number" && (
                <p className="px-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#8A7B77]">
                    {hasValue ? `${resultCount} of ${totalCount} orders shown` : `${totalCount} orders shown`}
                </p>
            )}
        </div>
    );
}
