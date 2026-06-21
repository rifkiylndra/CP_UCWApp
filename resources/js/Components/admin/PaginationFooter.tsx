import { Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPaginationLabel } from "@/lib/pagination";
import type { Paginated, PaginationLink } from "@/types/shared";

interface PaginationFooterProps<T> {
    data?: Paginated<T>;
    itemLabel: string;
    mobile?: boolean;
    variant?: "table" | "panel";
    compactLinks?: boolean;
    showFallbackControls?: boolean;
    linkData?: Record<string, unknown>;
    preserveScroll?: boolean;
    preserveState?: boolean;
}

export default function PaginationFooter<T>({
    data,
    itemLabel,
    mobile = false,
    variant = "table",
    compactLinks = false,
    showFallbackControls = false,
    linkData,
    preserveScroll = false,
    preserveState = false,
}: PaginationFooterProps<T>) {
    if (!data) return null;

    const hasLaravelLinks = Array.isArray(data.links) && data.links.length > 0;
    if (!hasLaravelLinks && !showFallbackControls) return null;

    const containerClass =
        variant === "panel"
            ? "mt-6 flex items-center justify-between gap-4 px-1 md:mt-10 md:px-4"
            : [
                  "flex items-center justify-between border-t border-[#F0ECEA]",
                  mobile ? "border-0 px-1 py-3" : "px-8 py-6",
              ].join(" ");

    return (
        <div className={containerClass}>
            <p className="text-[12px] font-medium text-[#5A4A47] md:text-[13px]">
                Showing {data.from || 0}-{data.to || 0} of {data.total || 0} {itemLabel}
            </p>

            <div className={variant === "panel" ? "flex items-center gap-2 md:gap-3" : "flex items-center gap-1 md:gap-2"}>
                {hasLaravelLinks ? (
                    data.links?.map((link, index) => (
                        <PaginationLinkItem
                            key={index}
                            link={link}
                            variant={variant}
                            compact={compactLinks}
                            linkData={linkData}
                            preserveScroll={preserveScroll}
                            preserveState={preserveState}
                        />
                    ))
                ) : (
                    <FallbackControls />
                )}
            </div>
        </div>
    );
}

function PaginationLinkItem({
    link,
    variant,
    compact,
    linkData,
    preserveScroll,
    preserveState,
}: {
    link: PaginationLink;
    variant: "table" | "panel";
    compact: boolean;
    linkData?: Record<string, unknown>;
    preserveScroll: boolean;
    preserveState: boolean;
}) {
    const label = getPaginationLabel(link.label);
    const sizeClass = compact ? "h-9 w-9 md:h-10 md:w-10" : "h-9 min-w-9 px-3 md:h-10";
    const radiusClass = variant === "panel" ? "rounded-[9px]" : "rounded-[10px]";
    const activeClass = link.active ? "bg-[#301713] text-white" : getInactiveLinkClass(variant);
    const disabledClass =
        variant === "panel"
            ? "bg-white/60 text-[#A69D9A]"
            : "border border-[#E8E3E1] bg-white/50 text-[#A69D9A] opacity-50";

    if (!link.url) {
        return (
            <span
                className={`flex ${sizeClass} items-center justify-center ${radiusClass} text-[13px] font-semibold ${disabledClass}`}
            >
                {renderPaginationLabel(label)}
            </span>
        );
    }

    let url = link.url;
    if (typeof window !== "undefined" && window.location.protocol === "https:" && url.startsWith("http:")) {
        url = url.replace(/^http:/, "https:");
    }

    return (
        <Link
            href={url}
            data={linkData}
            preserveScroll={preserveScroll}
            preserveState={preserveState}
            className={`flex ${sizeClass} items-center justify-center ${radiusClass} text-[13px] font-semibold transition ${activeClass}`}
        >
            {renderPaginationLabel(label)}
        </Link>
    );
}

function FallbackControls() {
    return (
        <>
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-white">
                <ChevronLeft size={17} />
            </button>
            <button type="button" className="h-9 w-9 rounded-[9px] bg-[#301713] text-[13px] font-extrabold text-white">
                1
            </button>
            <button type="button" className="hidden h-9 w-9 rounded-[9px] bg-white text-[13px] font-extrabold md:block">
                2
            </button>
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-white">
                <ChevronRight size={17} />
            </button>
        </>
    );
}

function getPaginationLabel(label: string) {
    const safeLabel = formatPaginationLabel(String(label));

    if (safeLabel.includes("Previous") || safeLabel.includes("«")) return <ChevronLeft size={17} />;
    if (safeLabel.includes("Next") || safeLabel.includes("»")) return <ChevronRight size={17} />;

    return safeLabel;
}

function getInactiveLinkClass(variant: "table" | "panel") {
    if (variant === "panel") return "bg-white text-[#5A4A47]";

    return "border border-[#E8E3E1] bg-white text-[#5A4A47] hover:bg-[#F4F4F3]";
}

function renderPaginationLabel(label: string | JSX.Element) {
    if (typeof label !== "string") return label;

    return <span>{label}</span>;
}
