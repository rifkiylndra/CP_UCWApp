import React, { useState, useEffect, useRef } from "react";
import type { AdminUser } from "@/types/admin";
import { Bell, CircleUserRound, Search, LogOut, Coffee, ShieldAlert, Sparkles } from "lucide-react";
import { Link, router } from "@inertiajs/react";

interface TopBarProps {
  user: AdminUser;
  title?: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export default function TopBar({ user, title }: TopBarProps) {
  const [searchVal, setSearchVal] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "init-1",
      title: "Selamat Datang!",
      message: `Halo ${user?.name || "Admin"}, sistem UCW App siap digunakan.`,
      time: "Baru saja",
      unread: true,
    }
  ]);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Sync url search query to search bar value on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const searchParam = params.get("search");
      if (searchParam) {
        setSearchVal(searchParam);
      }
    }
  }, []);

  // Handle Search submit
  const triggerSearch = (query: string) => {
    router.visit(route("admin.live-order", { search: query }), {
      preserveState: true,
      preserveScroll: true
    });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      triggerSearch(searchVal);
    }
  };

  // Listen to WebSocket Echo for real-time navbar notifications
  useEffect(() => {
    const echo = (window as any).Echo;
    if (echo) {
      echo.private("staff-orders")
        .listen(".order.placed", (event: any) => {
          const newNotif: NotificationItem = {
            id: `order-${Date.now()}`,
            title: "Pesanan Baru Masuk ☕",
            message: `Pesanan masuk dari ${event.customer_name || 'Pelanggan'} (Meja ${event.table_number || 'Takeaway'}).`,
            time: new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }),
            unread: true
          };
          setNotifications(prev => [newNotif, ...prev.slice(0, 9)]);
        });

      echo.private("staff-payments")
        .listen(".payment.status.updated", (event: any) => {
          if (event.payment_status === "paid") {
            const newNotif: NotificationItem = {
              id: `pay-${Date.now()}`,
              title: "Pembayaran Berhasil 💳",
              message: `Pembayaran untuk order #${event.order_id} telah lunas terverifikasi.`,
              time: new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }),
              unread: true
            };
            setNotifications(prev => [newNotif, ...prev.slice(0, 9)]);
          }
        });
    }

    return () => {
      if (echo) {
        echo.leave("staff-orders");
        echo.leave("staff-payments");
      }
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasUnread = notifications.some(n => n.unread);

  const handleOpenNotifications = () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen) {
      // Mark all as read when opening panel
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    }
  };

  return (
    <header className="flex flex-shrink-0 flex-col gap-3 bg-white px-4 pt-4 sm:px-6 md:h-[64px] md:flex-row md:items-center md:justify-between md:px-8 lg:px-9">
      {/* Mobile top bar layout */}
      <div className="flex items-center justify-between md:hidden">
        <h1 className="text-[20px] font-extrabold tracking-[-0.6px] text-[#271310]">
          {title}
        </h1>

        <div className="flex items-center gap-3 text-[#271310]">
          {/* Lonceng Notif (Mobile) */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={handleOpenNotifications}
              className="relative flex h-9 w-9 items-center justify-center rounded-full active:bg-[#F4F4F3]"
            >
              <Bell size={20} strokeWidth={2.2} />
              {hasUnread && (
                <span className="absolute right-[9px] top-[7px] h-[7.5px] w-[7.5px] rounded-full bg-[#B91C1C] ring-2 ring-white animate-pulse" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 z-50 w-[290px] rounded-2xl bg-white p-4 shadow-[0_10px_35px_rgba(0,0,0,0.12)] border border-[#ECE8E4]">
                <h4 className="text-[14px] font-bold text-[#271310] mb-3 flex items-center justify-between">
                  <span>Notifikasi Aktivitas</span>
                  {hasUnread && <span className="h-2 w-2 rounded-full bg-[#B91C1C]" />}
                </h4>
                <div className="max-h-[240px] overflow-y-auto space-y-2.5">
                  {notifications.length === 0 ? (
                    <p className="text-[12px] text-center text-[#887B76] py-4">Belum ada notifikasi baru.</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="p-2 rounded-lg bg-[#FDFDFD] hover:bg-[#F9F9F8] border-l-2 border-[#2A1712] transition">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold text-[#271310]">{n.title}</span>
                          <span className="text-[9px] text-[#AAA29F]">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-[#504442] mt-0.5 leading-[1.3]">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown Trigger (Mobile) */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full active:bg-[#F4F4F3]"
            >
              <CircleUserRound size={22} strokeWidth={2.2} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 z-50 w-[240px] rounded-2xl bg-white p-4 shadow-[0_10px_35px_rgba(0,0,0,0.12)] border border-[#ECE8E4]">
                <div className="flex items-center gap-3 pb-3 border-b border-[#F2EFEF]">
                  <div className="h-10 w-10 rounded-full bg-[#2A1712] flex items-center justify-center text-white font-extrabold text-[15px] uppercase">
                    {user?.name ? user.name[0] : "A"}
                  </div>
                  <div>
                    <h4 className="text-[13px] font-extrabold text-[#271310] leading-none mb-1">{user?.name}</h4>
                    <span className="inline-block px-2 py-0.5 text-[9px] font-extrabold rounded-md uppercase tracking-wider bg-[#2A1712]/10 text-[#2A1712]">
                      {user?.role === "super_admin" ? "Super Admin" : "Admin"}
                    </span>
                  </div>
                </div>
                <div className="py-2.5 space-y-1">
                  <div className="text-[11px] text-[#504442] px-1">
                    <span className="block text-[9px] uppercase tracking-wider text-[#AAA29F] mb-0.5">Username</span>
                    <span className="font-semibold">@{user?.username || "admin"}</span>
                  </div>
                  <div className="text-[11px] text-[#504442] px-1 pt-1">
                    <span className="block text-[9px] uppercase tracking-wider text-[#AAA29F] mb-0.5">Email</span>
                    <span className="font-semibold break-all">{user?.email || "admin@ucw.app"}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#F2EFEF]">
                  <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-2.5 text-[12px] font-extrabold text-red-600 transition hover:bg-red-100"
                  >
                    <LogOut size={15} />
                    <span>Logout System</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="relative w-full md:max-w-[445px]">
        <Search
          size={17}
          strokeWidth={2}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B0AE]"
        />

        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search orders by customer or ID..."
          className="h-[40px] w-full rounded-full border-0 bg-[#F8F8F7] pl-11 pr-4 text-[13.5px] font-semibold text-[#271310] placeholder:text-[#B8B0AE] focus:outline-none focus:ring-2 focus:ring-[#271310]/15 md:h-[36px]"
        />
        {searchVal && (
          <button 
            onClick={() => { setSearchVal(""); triggerSearch(""); }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#AAA29F] hover:text-[#271310]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Desktop navigation bar icons */}
      <div className="ml-6 hidden items-center gap-6 text-[#271310] md:flex">
        
        {/* Lonceng Notif (Desktop) */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={handleOpenNotifications}
            className="relative flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[#F4F4F3]"
            title="Notifications"
          >
            <Bell size={20} strokeWidth={2.2} />
            {hasUnread && (
              <span className="absolute right-[9px] top-[7px] h-[7.5px] w-[7.5px] rounded-full bg-[#B91C1C] ring-2 ring-white animate-pulse" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2.5 z-50 w-[310px] rounded-2xl bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-[#ECE8E4]">
              <h4 className="text-[14px] font-bold text-[#271310] mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Coffee size={15} className="text-[#2A1712]" />
                  Activity Logs
                </span>
                {hasUnread && <span className="px-2 py-0.5 text-[9px] rounded bg-red-100 text-red-700 font-extrabold uppercase">New</span>}
              </h4>
              <div className="max-h-[280px] overflow-y-auto space-y-2.5 pr-0.5">
                {notifications.length === 0 ? (
                  <p className="text-[11px] text-center text-[#887B76] py-6">Belum ada notifikasi baru.</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-[#FDFDFD] hover:bg-[#F9F9F8] border-l-3 border-[#2A1712] transition shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center justify-between">
                        <span className="text-[11.5px] font-extrabold text-[#271310]">{n.title}</span>
                        <span className="text-[9.5px] text-[#AAA29F] font-medium">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-[#504442] mt-0.5 leading-[1.35]">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown (Desktop) */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[#F4F4F3]"
            title={user?.name || "Admin Profile"}
          >
            <CircleUserRound size={22} strokeWidth={2.2} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2.5 z-50 w-[260px] rounded-2xl bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-[#ECE8E4]">
              <div className="flex items-center gap-3 pb-3.5 border-b border-[#F2EFEF]">
                <div className="h-11 w-11 rounded-full bg-[#2A1712] flex items-center justify-center text-white font-extrabold text-[16px] uppercase shadow-[0_2px_8px_rgba(42,23,18,0.2)]">
                  {user?.name ? user.name[0] : "A"}
                </div>
                <div>
                  <h4 className="text-[13.5px] font-extrabold text-[#271310] leading-none mb-1.5">{user?.name}</h4>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-black rounded-md uppercase tracking-wider bg-[#2A1712]/10 text-[#2A1712]">
                    <Sparkles size={8} />
                    {user?.role === "super_admin" ? "Super Admin" : "Admin"}
                  </span>
                </div>
              </div>
              
              <div className="py-3 space-y-2">
                <div className="text-[11.5px] text-[#504442] px-1">
                  <span className="block text-[9.5px] font-bold uppercase tracking-wider text-[#AAA29F] mb-0.5">Admin Username</span>
                  <span className="font-semibold text-[#271310]">@{user?.username || "admin"}</span>
                </div>
                <div className="text-[11.5px] text-[#504442] px-1">
                  <span className="block text-[9.5px] font-bold uppercase tracking-wider text-[#AAA29F] mb-0.5">Account Email</span>
                  <span className="font-semibold text-[#271310] break-all">{user?.email || "admin@ucw.app"}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F2EFEF]">
                <Link
                  href={route('logout')}
                  method="post"
                  as="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-2.5 text-[12px] font-extrabold text-red-600 transition hover:bg-red-100"
                  title="Logout"
                >
                  <LogOut size={15} />
                  <span>Logout System</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick Logout Button */}
        <Link
          href={route('logout')}
          method="post"
          as="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#B91C1C] transition hover:bg-[#F4F4F3]"
          title="Quick Logout"
        >
          <LogOut size={20} strokeWidth={2.2} />
        </Link>
      </div>
    </header>
  );
}