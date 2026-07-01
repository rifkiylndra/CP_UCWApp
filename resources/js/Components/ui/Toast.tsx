import { useEffect } from "react";

interface ToastProps {
    message: string;
    type: "success" | "error" | "info";
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const bgColor = {
        success: "bg-[#5E735B] text-white border-l-4 border-[#3D4D3A]",
        error: "bg-[#C62828] text-white border-l-4 border-[#8E1C1C]",
        info: "bg-[#271310] text-[#ECE8E4] border-l-4 border-[#D99A2B]",
    }[type];

    const icon = {
        success: (
            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        info: (
            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    }[type];

    return (
        <div className="fixed bottom-5 right-5 z-[9999]">
            <div className={`flex items-center p-4 rounded-[16px] shadow-lg max-w-sm transition-all duration-300 transform scale-100 hover:scale-[1.02] ${bgColor}`}>
                {icon}
                <div className="text-[13px] font-bold font-['Manrope'] pr-2">{message}</div>
                <button 
                    onClick={onClose}
                    className="ml-auto text-white hover:text-gray-200 transition-colors focus:outline-none"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
