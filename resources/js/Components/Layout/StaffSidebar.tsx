import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { LayoutDashboard, ReceiptText } from "lucide-react";

interface Props {
    currentRoute: string;
}

export default function StaffSidebar({ currentRoute }: Props) {
    const navItems = [
        {
            key: "dashboard",
            label: "Dashboard",
            href: route("staff.dashboard"),
            icon: LayoutDashboard,
        },
        {
            key: "transactions",
            label: "History",
            href: route("staff.transactions"),
            icon: ReceiptText,
        },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="fixed left-0 top-[76px] z-30 hidden h-[calc(100vh-76px)] w-[272px] flex-col bg-[#F9F9F8] px-5 py-6 font-['Manrope'] lg:flex">
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentRoute === item.key;

                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={[
                                    "flex h-12 items-center gap-3 rounded-2xl px-4 text-[14px] font-bold transition-all",
                                    isActive
                                        ? "bg-[#271310] text-white"
                                        : "bg-[#F9F9F8] text-[#5A4A47] hover:bg-[#F4F4F3]",
                                ].join(" ")}
                            >
                                <Icon size={20} strokeWidth={2.3} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="fixed bottom-0 left-0 z-50 grid h-[72px] w-full grid-cols-2 border-t border-[#ECE8E4] bg-[#F9F9F8] px-4 pb-3 pt-2 font-['Manrope'] lg:hidden">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentRoute === item.key;

                    return (
                        <Link
                            key={item.key}
                            href={item.href}
                            className={[
                                "flex flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-bold transition",
                                isActive
                                    ? "bg-[#F4F4F3] text-[#271310]"
                                    : "text-[#5A4A47]",
                            ].join(" ")}
                        >
                            <Icon size={20} strokeWidth={2.3} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}