import React from "react";
import { Link } from "@inertiajs/react";
import {
  LayoutGrid,
  ClipboardList,
  Sparkles,
  MessageSquare,
  UtensilsCrossed,
  MoreHorizontal,
} from "lucide-react";

interface MobileBottomNavProps {
  currentRoute: string;
}

export default function MobileBottomNav({ currentRoute }: MobileBottomNavProps) {
  const getSafeRoute = (routeName: string) => {
    try {
      return route(routeName as any);
    } catch {
      return "#";
    }
  };

  const navItems = [
    { name: "Overview", route: "admin.overview", icon: LayoutGrid },
    { name: "Orders", route: "admin.live-order", icon: ClipboardList },
    { name: "AI", route: "admin.analytics-page", icon: Sparkles },
    { name: "Feedback", route: "admin.feedback", icon: MessageSquare },
    { name: "Menu", route: "admin.menu", icon: UtensilsCrossed },
    { name: "More", route: "admin.staff", icon: MoreHorizontal },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E9E6E4] bg-white/95 px-3 py-2 backdrop-blur-md md:hidden">
      <div className="grid grid-cols-6">
        {navItems.map((item) => {
          const active = currentRoute === item.route;
          const Icon = item.icon;

          return (
            <Link
              key={item.route}
              href={getSafeRoute(item.route)}
              className={[
                "flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold transition",
                active
                  ? "bg-[#F4F4F3] text-[#271310]"
                  : "text-[#8B807D]",
              ].join(" ")}
            >
              <Icon size={19} strokeWidth={active ? 2.5 : 2} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
