import React from "react";
import type { AdminUser } from "@/types/admin";
import { Bell, CircleUserRound, Search } from "lucide-react";

interface TopBarProps {
  user: AdminUser;
}

export default function TopBar({ user }: TopBarProps) {
  return (
    <header className="flex h-[64px] flex-shrink-0 items-center justify-between bg-white px-8 pt-4 lg:px-9">
      <div className="relative w-full max-w-[445px]">
        <Search
          size={17}
          strokeWidth={2}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B0AE]"
        />

        <input
          type="text"
          placeholder="Search orders or analytics..."
          className="h-[36px] w-full rounded-full border-0 bg-[#F8F8F7] pl-11 pr-4 text-[14px] font-medium text-[#271310] placeholder:text-[#B8B0AE] focus:outline-none focus:ring-2 focus:ring-[#271310]/10"
        />
      </div>

      <div className="ml-6 flex items-center gap-7 text-[#271310]">
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[#F4F4F3]">
          <Bell size={20} strokeWidth={2.2} />
          <span className="absolute right-[9px] top-[7px] h-[7px] w-[7px] rounded-full bg-[#B91C1C] ring-2 ring-white" />
        </button>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[#F4F4F3]"
          title={user?.name || "Admin Profile"}
        >
          <CircleUserRound size={22} strokeWidth={2.2} />
        </button>
      </div>
    </header>
  );
}