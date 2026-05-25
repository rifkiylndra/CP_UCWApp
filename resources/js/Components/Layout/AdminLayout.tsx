import React, { ReactNode } from "react";
import { Head } from "@inertiajs/react";
import type { AdminUser } from "@/types/admin";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface AdminLayoutProps {
  children: ReactNode;
  auth: { user: AdminUser };
  title?: string;
  currentRoute?: string;
}

export default function AdminLayout({
  children,
  auth,
  title = "Dashboard",
  currentRoute = "admin.overview",
}: AdminLayoutProps) {
  const safeUser = auth?.user || {
    name: "Julian Reed",
    role: "Masterroaster",
    avatar: "",
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-white font-['Manrope'] text-[#271310]">
      <Head title={`${title} — Admin UCW`} />

      <div className="flex h-full w-full overflow-hidden">
        <Sidebar user={safeUser} currentRoute={currentRoute} />

        <div className="flex min-w-0 flex-1 flex-col bg-white">
          <TopBar user={safeUser} />

          <main className="flex-1 overflow-y-auto px-8 pb-8 pt-6 lg:px-9">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}