import { Link } from "@inertiajs/react";
import type { StaffUser } from "@/types/staff";
import { route } from "ziggy-js";
import { LayoutDashboard, ReceiptText } from "lucide-react";

interface Props {
    user: StaffUser;
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
            label: "History Transaksi",
            href: route("staff.transactions"),
            icon: ReceiptText,
        },
    ];

    return (
        <aside className="fixed left-0 top-[76px] z-30 flex h-[calc(100vh-76px)] w-[272px] flex-col bg-[#F9F9F8] px-5 py-6 font-['Manrope']">
            

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
                                    ? "bg-[#F4F4F3] text-[#271310]"
                                    : "bg-[#F9F9F8] text-[#5A4A47] hover:bg-[#F4F4F3]",
                            ].join(" ")}
                        >
                            <Icon
                                size={20}
                                strokeWidth={2.3}
                                className={isActive ? "text-[#271310]" : "text-[#5A4A47]"}
                            />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}