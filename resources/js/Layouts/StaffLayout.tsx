import { ReactNode } from "react";
import { Head } from "@inertiajs/react";
import StaffSidebar from "@/Components/Layout/StaffSidebar";
import type { StaffUser } from "@/types/staff";
import { Bell, UserRound } from "lucide-react";

interface Props {
    children: ReactNode;
    auth: { user: StaffUser };
    title?: string;
    currentRoute?: "dashboard" | "transactions" | string;
}

export default function StaffLayout({
    children,
    auth,
    title,
    currentRoute = "dashboard",
}: Props) {
    return (
        <div className="min-h-screen bg-[#F9F9F8] font-['Manrope']">
            {title && <Head title={title} />}

            <header className="fixed left-0 top-0 z-40 flex h-[76px] w-full items-center justify-between bg-[#F9F9F8] px-8">
                <h1 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#271310]">
                    Unand Coworkspace
                </h1>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F4F4F3] text-[#271310] transition hover:bg-[#ECECEA]"
                    >
                        <Bell size={20} strokeWidth={2.2} />
                    </button>

                    <button
                        type="button"
                        className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#F4F4F3] text-[#271310] transition hover:bg-[#ECECEA]"
                        title={auth.user.name}
                    >
                        {auth.user.avatarUrl ? (
                            <img
                                src={auth.user.avatarUrl}
                                alt={auth.user.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <UserRound size={21} strokeWidth={2.2} />
                        )}
                    </button>
                </div>
            </header>

            <div className="flex min-h-screen pt-[76px] bg-[#F9F9F8]">
                <StaffSidebar user={auth.user} currentRoute={currentRoute} />

                <main className="ml-[272px] flex-1 bg-[#F9F9F8] p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}