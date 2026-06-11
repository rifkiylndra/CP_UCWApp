import Spinner from "@/Components/ui/Spinner";

interface LoadingStateProps {
    title?: string;
    message?: string;
}

export default function LoadingState({
    title = "Loading",
    message = "Please wait while the data is being prepared.",
}: LoadingStateProps) {
    return (
        <div className="flex min-h-[180px] flex-col items-center justify-center rounded-[18px] border border-[#E8E3E1] bg-white px-6 py-10 text-center">
            <Spinner size="md" />
            <h3 className="mt-4 text-[15px] font-extrabold text-[#271310]">
                {title}
            </h3>
            <p className="mt-2 max-w-sm text-[13px] font-medium leading-relaxed text-[#5A4A47]">
                {message}
            </p>
        </div>
    );
}
