import React, { useState } from "react";
import AdminLayout from "@/Components/Layout/AdminLayout";
import type { AdminUser } from "@/types/admin";
import AddStaffModal from "@/Components/Modals/AddStaffModal"; // sesuaikan path
import {
  UserPlus,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";

interface StaffIndexProps {
  auth: { user: AdminUser };
}

export default function StaffIndex({ auth }: StaffIndexProps) {
  // ✅ useState dideklarasi di dalam komponen
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);

  const staff = [
    {
      id: "#UCW-2042",
      name: "Marcus Holloway",
      email: "marcus.h@unand.co",
      role: "Barista",
      roleColor: "green",
      date: "Oct 12, 2023",
      img: "https://i.pravatar.cc/100?img=13",
    },
    {
      id: "#UCW-2045",
      name: "Sarah Chen",
      email: "s.chen@unand.co",
      role: "Cashier",
      roleColor: "yellow",
      date: "Nov 05, 2023",
      img: "https://i.pravatar.cc/100?img=32",
    },
    {
      id: "#UCW-2051",
      name: "Julian Vane",
      email: "j.vane@unand.co",
      role: "Barista",
      roleColor: "green",
      date: "Jan 18, 2024",
      img: "https://i.pravatar.cc/100?img=15",
    },
    {
      id: "#UCW-2058",
      name: "Amelie Rocher",
      email: "amelie.r@unand.co",
      role: "Cashier",
      roleColor: "yellow",
      date: "Feb 02, 2024",
      img: "https://i.pravatar.cc/100?img=44",
    },
  ];

  // ✅ handleEdit sekarang membuka modal dengan data staff terpilih
  const handleEdit = (item: any) => {
    setSelectedStaff(item);
    setIsStaffModalOpen(true);
  };

  const handleDelete = (id: string) => {
    console.log("Delete staff:", id);
  };

  return (
    <AdminLayout auth={auth} title="Staff Management" currentRoute="admin.staff">
      {/* ✅ AddStaffModal dipindah ke dalam JSX return */}
      <AddStaffModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        staffToEdit={selectedStaff}
      />

      <section className="font-['Manrope'] text-[#271310]">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="mb-5 text-[13px] font-bold uppercase tracking-[0.08em] text-[#5A4A47]">
              Directory
            </p>
            <h1 className="text-[32px] font-extrabold tracking-[-1.2px]">
              Staff Management
            </h1>
          </div>

          {/* ✅ onClick yang benar untuk Add New Staff */}
          <button
            className="flex h-12 w-fit items-center justify-center gap-3 rounded-[10px] bg-[#301713] px-7 text-[14px] font-extrabold text-white shadow-[0_14px_28px_rgba(39,19,16,0.16)]"
            onClick={() => {
              setSelectedStaff(null);
              setIsStaffModalOpen(true);
            }}
          >
            <UserPlus size={19} />
            Add New Staff
          </button>
        </div>

        {/* Stats */}
        <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-[190px_190px_1fr]">
          <div className="rounded-[22px] bg-[#FAFAF9] p-6 shadow-[0_10px_28px_rgba(39,19,16,0.03)]">
            <p className="mb-3 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#5A4A47]">
              Total Staff
            </p>
            <h2 className="text-[32px] font-extrabold leading-none">24</h2>
            <p className="mt-5 text-[12px] font-semibold text-[#53664F]">
              ↗ +2 this month
            </p>
          </div>

          <div className="rounded-[22px] bg-[#FAFAF9] p-6 shadow-[0_10px_28px_rgba(39,19,16,0.03)]">
            <p className="mb-3 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#5A4A47]">
              On Duty
            </p>
            <h2 className="text-[32px] font-extrabold leading-none">08</h2>
            <p className="mt-5 flex items-center gap-2 text-[12px] font-semibold text-[#53664F]">
              <span className="h-2 w-2 rounded-full bg-[#53664F]" />
              Full capacity
            </p>
          </div>

          <div className="flex items-center justify-between rounded-[22px] border border-[#D7E8D2] bg-[#F0F7ED] p-6">
            <div>
              <p className="mb-4 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#60765D]">
                Barista of the Month
              </p>
              <h2 className="text-[24px] font-extrabold">Elena Gilbert</h2>
              <p className="mt-2 text-[15px] font-medium text-[#7D8C78]">
                98% Customer Rating
              </p>
            </div>
            <img
              src="https://i.pravatar.cc/100?img=47"
              alt="Elena Gilbert"
              className="h-[72px] w-[72px] rounded-[18px] object-cover grayscale"
            />
          </div>
        </div>

        {/* Table */}
        <div className="mb-12 overflow-hidden rounded-[28px] bg-white shadow-[0_18px_45px_rgba(39,19,16,0.05)]">
          <div className="flex items-center justify-between px-8 py-8">
            <h2 className="text-[18px] font-extrabold">Team Roster</h2>
            <div className="flex items-center gap-6">
              <button className="text-[#271310]">
                <Filter size={18} />
              </button>
              <button className="text-[#271310]">
                <Download size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[150px_1.4fr_150px_190px_130px] bg-[#FAFAF9] px-8 py-5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#8B807D]">
            <span>User ID</span>
            <span>Staff Member</span>
            <span>Role</span>
            <span>Registration Date</span>
            <span className="text-center">Action</span>
          </div>

          {staff.map((item) => (
            <div
              key={item.id}
              className="grid min-h-[84px] grid-cols-[150px_1.4fr_150px_190px_130px] items-center border-t border-[#F0ECEA] px-8"
            >
              <p className="text-[15px] font-medium text-[#5A4A47]">{item.id}</p>

              <div className="flex items-center gap-4">
                <img
                  src={item.img}
                  alt={item.name}
                  className="h-10 w-10 rounded-[10px] object-cover"
                />
                <div>
                  <p className="text-[14px] font-extrabold">{item.name}</p>
                  <p className="text-[12px] font-medium text-[#5A4A47]">{item.email}</p>
                </div>
              </div>

              <div>
                <span
                  className={`rounded-full px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] ${
                    item.roleColor === "yellow"
                      ? "bg-[#FFE3A7] text-[#8C651C]"
                      : "bg-[#DDEED8] text-[#60765D]"
                  }`}
                >
                  {item.role}
                </span>
              </div>

              <p className="text-[14px] font-medium text-[#5A4A47]">{item.date}</p>

              <div className="flex justify-center gap-2">
                {/* ✅ Satu onClick saja, tidak duplikat */}
                <button
                  onClick={() => handleEdit(item)}
                  className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#ECE8E6] bg-white text-[#5A4A47] transition hover:bg-[#F5F4F3] hover:text-[#271310]"
                >
                  <Pencil size={15} strokeWidth={2.4} />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#F3DEDE] bg-[#FFF8F8] text-[#B42318] transition hover:bg-[#FDECEC]"
                >
                  <Trash2 size={15} strokeWidth={2.4} />
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-[#F0ECEA] px-8 py-6">
            <p className="text-[13px] font-medium text-[#5A4A47]">
              Showing 1 to 4 of 24 staff members
            </p>
            <div className="flex items-center gap-3">
              <button className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E8E3E1]">
                <ChevronLeft size={18} />
              </button>
              <button className="h-10 w-10 rounded-[10px] bg-[#301713] text-[13px] font-extrabold text-white">
                1
              </button>
              <button className="h-10 w-10 rounded-[10px] border border-[#E8E3E1] text-[13px] font-semibold">
                2
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E8E3E1]">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="rounded-[34px] bg-[#3A1D18] p-12 text-white shadow-[0_18px_42px_rgba(39,19,16,0.16)]">
          <p className="mb-6 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#DDEED8]">
            Workspace Optimization
          </p>
          <h2 className="text-[17px] font-extrabold">
            Analyze Shift Performance with AI Insights
          </h2>
          <p className="mt-8 max-w-[610px] text-[15px] leading-relaxed text-white/45">
            Identify your peak hours and staff efficiently. Our new AI Analytics
            module helps you predict footfall and coffee orders with 94% accuracy.
          </p>
          <button className="mt-8 h-12 rounded-[10px] bg-[#DDEED8] px-8 text-[13px] font-extrabold text-[#271310]">
            Launch Analytics
          </button>
        </div>
      </section>
    </AdminLayout>
  );
}