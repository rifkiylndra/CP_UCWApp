import React from "react";
import { Link } from "@inertiajs/react";
import type { AdminUser } from "@/types/admin";
import {
  LayoutGrid,
  ClipboardList,
  Sparkles,
  UtensilsCrossed,
  BriefcaseBusiness,
  Banknote,
  Settings,
} from "lucide-react";

interface SidebarProps {
  user: AdminUser;
  currentRoute: string;
}

export default function Sidebar({ user, currentRoute }: SidebarProps) {
  const getSafeRoute = (routeName: string) => {
    try {
      return route(routeName as any);
    } catch {
      return "#";
    }
  };

  const navItems = [
    { name: "Overview", route: "admin.overview", icon: LayoutGrid },
    { name: "Live Order", route: "admin.live-order", icon: ClipboardList },
    { name: "AI Analytics", route: "admin.analytics", icon: Sparkles },
    { name: "Menu", route: "admin.menu", icon: UtensilsCrossed },
    { name: "Staff", route: "admin.staff", icon: BriefcaseBusiness },
    { name: "Finances", route: "admin.finances", icon: Banknote },
    
  ];

  return (
    <aside className="hidden h-full w-[254px] flex-shrink-0 flex-col border-r border-[#E9E6E4] bg-[#F9F9F8] md:flex">
      <div className="px-8 pb-8 pt-9">
        <h1 className="max-w-[150px] text-[18px] font-extrabold uppercase leading-[1.22] tracking-[0.12em] text-[#271310]">
          UNAND CO-WORKSPACE
        </h1>
        <p className="mt-2 text-[12px] font-medium text-[#50444299]">
          Editorial Barista Admin
        </p>
      </div>

      <nav className="flex-1 px-4">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = currentRoute === item.route;
            const Icon = item.icon;

            return (
              <Link
                key={item.route}
                href={getSafeRoute(item.route)}
                className={[
                  "relative flex h-[44px] items-center gap-3 rounded-none px-4 text-[13px] font-semibold transition",
                  active
                    ? "bg-[#F4F4F3] text-[#271310]"
                    : "bg-[#F9F9F8] text-[#5A4A47] hover:bg-[#F4F4F3] hover:text-[#271310]",
                ].join(" ")}
              >
                <Icon
                  size={19}
                  strokeWidth={active ? 2.4 : 2}
                  className={active ? "text-[#271310]" : "text-[#5A4A47]"}
                />

                <span>{item.name}</span>

                {active && (
                  <span className="absolute right-0 top-0 h-full w-[3px] bg-[#271310]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="px-8 pb-8">
        

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-[#EAE7E4]">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-extrabold text-[#271310]">
                {user.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-[13px] font-extrabold text-[#271310]">
              {user.name || "Julian Reed"}
            </p>
            <p className="text-[9px] font-bold uppercase tracking-wide text-[#50444299]">
              {user.role || "Masterroaster"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}