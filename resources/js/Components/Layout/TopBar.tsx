import React from "react";
import type { AdminUser } from "@/types/admin";
import { Bell, CircleUserRound, Search } from "lucide-react";

interface TopBarProps {
  user: AdminUser;
  title?: string;
}

export default function TopBar({ user, title }: TopBarProps) {
  return (
    <header className="flex flex-shrink-0 flex-col gap-3 bg-white px-4 pt-4 sm:px-6 md:h-[64px] md:flex-row md:items-center md:justify-between md:px-8 lg:px-9">
      <div className="flex items-center justify-between md:hidden">
        <h1 className="text-[20px] font-extrabold tracking-[-0.6px] text-[#271310]">
          {title}
        </h1>

        <div className="flex items-center gap-3 text-[#271310]">
          <button className="relative flex h-9 w-9 items-center justify-center rounded-full">
            <Bell size={20} strokeWidth={2.2} />
            <span className="absolute right-[9px] top-[7px] h-[7px] w-[7px] rounded-full bg-[#B91C1C] ring-2 ring-white" />
          </button>

          <button className="flex h-9 w-9 items-center justify-center rounded-full">
            <CircleUserRound size={22} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <div className="relative w-full md:max-w-[445px]">
        <Search
          size={17}
          strokeWidth={2}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B0AE]"
        />

        <input
          type="text"
          placeholder="Search orders or analytics..."
          className="h-[40px] w-full rounded-full border-0 bg-[#F8F8F7] pl-11 pr-4 text-[14px] font-medium text-[#271310] placeholder:text-[#B8B0AE] focus:outline-none focus:ring-2 focus:ring-[#271310]/10 md:h-[36px]"
        />
      </div>

      <div className="ml-6 hidden items-center gap-7 text-[#271310] md:flex">
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