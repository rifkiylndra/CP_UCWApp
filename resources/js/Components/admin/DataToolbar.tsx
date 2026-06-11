import { Download, Filter, Search } from "lucide-react";
import type { SelectOption } from "@/types/shared";

interface DataToolbarProps {
    title?: string;
    searchValue?: string;
    searchPlaceholder?: string;
    onSearchChange?: (value: string) => void;
    filterValue?: string;
    filterOptions?: SelectOption[];
    onFilterChange?: (value: string) => void;
    exportHref?: string;
    exportLabel?: string;
    className?: string;
    controlsClassName?: string;
    searchClassName?: string;
    exportClassName?: string;
}

export default function DataToolbar({
    title,
    searchValue,
    searchPlaceholder = "Search...",
    onSearchChange,
    filterValue,
    filterOptions,
    onFilterChange,
    exportHref,
    exportLabel = "Export",
    className = "flex items-center justify-between px-8 py-8",
    controlsClassName = "flex items-center gap-4",
    searchClassName = "relative w-full sm:w-[280px] lg:w-[260px]",
    exportClassName = "flex h-10 items-center gap-2 rounded-[12px] bg-[#DDEED8] px-4 text-[13px] font-extrabold text-[#53664F]",
}: DataToolbarProps) {
    const hasSearch = typeof searchValue === "string" && onSearchChange;
    const hasFilter = filterOptions && filterValue !== undefined && onFilterChange;

    return (
        <div className={className}>
            {title ? <h2 className="text-[18px] font-extrabold">{title}</h2> : null}

            <div className={controlsClassName}>
                {hasSearch ? (
                    <div className={searchClassName}>
                        <Search
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A4A47]"
                        />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(event) => onSearchChange(event.target.value)}
                            className="h-11 w-full rounded-[14px] border-none bg-white pl-11 pr-4 text-[13px] font-medium text-[#271310] outline-none placeholder:text-[#9A8F8B]"
                        />
                    </div>
                ) : null}

                {hasFilter ? (
                    <div className="flex h-10 items-center gap-2 rounded-[12px] border border-[#ECE8E6] bg-[#FAFAF9] px-3">
                        <Filter size={16} />
                        <select
                            value={filterValue}
                            onChange={(event) => onFilterChange(event.target.value)}
                            className="border-0 bg-transparent text-[13px] font-bold text-[#271310] outline-none focus:ring-0"
                        >
                            {filterOptions.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                    disabled={option.disabled}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : null}

                {exportHref ? (
                    <a href={exportHref} className={exportClassName}>
                        <Download size={16} />
                        {exportLabel}
                    </a>
                ) : null}
            </div>
        </div>
    );
}
