import { ReactNode } from "react";
import { Head, Link } from "@inertiajs/react";
import StaffSidebar from "@/Components/Layout/StaffSidebar";
import type { StaffUser } from "@/types/staff";
import { Bell, UserRound, LogOut } from "lucide-react";

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

            <header className="fixed left-0 top-0 z-40 flex h-[68px] w-full items-center justify-between border-b border-[#ECE8E4] bg-[#F9F9F8] px-4 lg:h-[76px] lg:px-8">
                <h1 className="text-[17px] font-extrabold tracking-[-0.03em] text-[#271310] lg:text-[22px]">
                    UNAND Co-Workspace
                </h1>

                <div className="flex items-center gap-2 lg:gap-3">
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F4F3] text-[#271310] lg:h-11 lg:w-11">
                        <Bell size={19} strokeWidth={2.2} />
                    </button>

                    <button
                        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#F4F4F3] text-[#271310] lg:h-11 lg:w-11"
                        title={auth.user.name}
                    >
                        {auth.user.avatarUrl ? (
                            <img
                                src={auth.user.avatarUrl}
                                alt={auth.user.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <UserRound size={20} strokeWidth={2.2} />
                        )}
                    </button>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F4F3] text-[#B91C1C] transition hover:bg-[#FDECEC] lg:h-11 lg:w-11"
                        title="Logout"
                    >
                        <LogOut size={19} strokeWidth={2.2} />
                    </Link>
                </div>
            </header>

            <StaffSidebar currentRoute={currentRoute} />

            <main className="min-h-screen bg-[#F9F9F8] px-4 pb-[92px] pt-[88px] lg:ml-[272px] lg:px-8 lg:pb-8 lg:pt-[108px]">
                {children}
            </main>
        </div>
    );
}