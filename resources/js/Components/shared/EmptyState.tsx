import type { ReactNode } from "react";

interface EmptyStateProps {
    title?: string;
    message?: string;
    action?: ReactNode;
}

export default function EmptyState({
    title = "No data yet",
    message = "Data will appear here once it is available.",
    action,
}: EmptyStateProps) {
    return (
        <div className="rounded-[18px] border border-dashed border-[#DED7D3] bg-white px-5 py-10 text-center">
            <h3 className="text-[16px] font-extrabold text-[#271310]">
                {title}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-[13px] font-medium leading-relaxed text-[#5A4A47]">
                {message}
            </p>
            {action && <div className="mt-5 flex justify-center">{action}</div>}
        </div>
    );
}
