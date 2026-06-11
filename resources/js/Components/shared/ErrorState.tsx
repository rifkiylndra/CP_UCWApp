import type { ReactNode } from "react";

interface ErrorStateProps {
    title?: string;
    message?: string;
    action?: ReactNode;
}

export default function ErrorState({
    title = "Something went wrong",
    message = "Please try again in a moment.",
    action,
}: ErrorStateProps) {
    return (
        <div className="rounded-[18px] border border-[#F3DEDE] bg-[#FFF8F8] px-5 py-10 text-center">
            <h3 className="text-[16px] font-extrabold text-[#B42318]">
                {title}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-[13px] font-medium leading-relaxed text-[#7A4A46]">
                {message}
            </p>
            {action && <div className="mt-5 flex justify-center">{action}</div>}
        </div>
    );
}
