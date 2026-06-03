import { Link } from "@inertiajs/react";
import type { StaffUser } from "@/types/staff";
import { LayoutDashboard, ReceiptText, LogOut } from "lucide-react";

interface Props {
    currentRoute: string;
    user: StaffUser;
}

export default function StaffSidebar({ currentRoute, user }: Props) {
    const getSafeRoute = (routeName: string) => {
        try {
            return route(routeName as any);
        } catch {
            return "#";
        }
    };

    const navItems = [
        {
            key: "dashboard",
            label: "Dashboard",
            href: getSafeRoute("staff.dashboard"),
            icon: LayoutDashboard,
        },
        {
            key: "transactions",
            label: "History",
            href: getSafeRoute("staff.transactions"),
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

                <div className="mt-auto pt-6">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#EAE7E4]">
                                {user.avatar || user.avatarUrl ? (
                                    <img
                                        src={user.avatar || user.avatarUrl}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-sm font-extrabold text-[#271310]">
                                        {user.name?.charAt(0)?.toUpperCase() || "S"}
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-[13px] font-extrabold text-[#271310]">
                                    {user.name}
                                </p>
                                <p className="truncate text-[9px] font-bold uppercase tracking-wide text-[#50444299]">
                                    {user.username || user.role}
                                </p>
                            </div>
                        </div>

                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[#A69D9A] transition hover:bg-[#F4F4F3] hover:text-[#B42318]"
                        >
                            <LogOut size={18} />
                        </Link>
                    </div>
                </div>
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
