import React, { useState } from "react";
import AdminLayout from "@/Components/Layout/AdminLayout";
import type { AdminUser } from "@/types/admin";
import AddStaffModal from "@/Components/Modals/AddStaffModal";
import {
  UserPlus,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";

import { router, Link } from "@inertiajs/react";

interface StaffIndexProps {
  auth: { user: AdminUser };
  staffs: any; // data pagination dari Laravel
}

export default function StaffIndex({ auth, staffs }: StaffIndexProps) {
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);

  const staff = staffs?.data || [];

  const handleAdd = () => {
    setSelectedStaff(null);
    setIsStaffModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedStaff(item);
    setIsStaffModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus staff ini?")) {
      router.delete(route("admin.staff.destroy", id as any));
    }
  };

  return (
    <AdminLayout auth={auth} title="Staff Management" currentRoute="admin.staff">
      <AddStaffModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        staffToEdit={selectedStaff}
      />

      <section className="font-['Manrope'] text-[#271310]">
        <div className="mb-8 flex flex-col gap-5 lg:mb-12 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#5A4A47] md:mb-5 md:text-[13px]">
              Directory
            </p>
            <h1 className="text-[30px] font-extrabold tracking-[-1px] md:text-[32px] md:tracking-[-1.2px]">
              Staff Management
            </h1>
          </div>

          <button
            onClick={handleAdd}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-[12px] bg-[#301713] px-7 text-[14px] font-extrabold text-white shadow-[0_14px_28px_rgba(39,19,16,0.16)] sm:w-fit"
          >
            <UserPlus size={19} />
            Add New Staff
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mb-12 lg:grid-cols-[190px_190px_1fr] lg:gap-6">
          <StatBox title="Total Staff" value="24" desc="↗ +2 this month" />
          <StatBox title="On Duty" value="08" desc="● Full capacity" />

          <div className="flex items-center justify-between rounded-[22px] border border-[#D7E8D2] bg-[#F0F7ED] p-5 sm:col-span-2 lg:col-span-1 lg:p-6">
            <div>
              <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#60765D] md:text-[12px]">
                Barista of the Month
              </p>
              <h2 className="text-[20px] font-extrabold md:text-[24px]">
                Elena Gilbert
              </h2>
              <p className="mt-2 text-[13px] font-medium text-[#7D8C78] md:text-[15px]">
                98% Customer Rating
              </p>
            </div>
            <img
              src="https://i.pravatar.cc/100?img=47"
              alt="Elena Gilbert"
              className="h-[62px] w-[62px] rounded-[18px] object-cover grayscale md:h-[72px] md:w-[72px]"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="mb-12 hidden overflow-hidden rounded-[28px] bg-white shadow-[0_18px_45px_rgba(39,19,16,0.05)] lg:block">
          <RosterHeader />

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
              <p className="text-[15px] font-medium text-[#5A4A47]">
                {item.id}
              </p>

              <StaffIdentity item={item} />

              <RoleBadge item={item} />

              <p className="text-[14px] font-medium text-[#5A4A47]">
                {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>

              <ActionButtons
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item.id)}
              />
            </div>
          ))}

          <PaginationFooter data={staffs} />
        </div>

        {/* Mobile Card List */}
        <div className="mb-10 space-y-4 lg:hidden">
          <div className="mb-4 flex items-center justify-between rounded-[20px] bg-white px-5 py-4 shadow-[0_10px_28px_rgba(39,19,16,0.04)]">
            <h2 className="text-[17px] font-extrabold">Team Roster</h2>
            <div className="flex items-center gap-5">
              <button className="text-[#271310]">
                <Filter size={18} />
              </button>
              <button className="text-[#271310]">
                <Download size={18} />
              </button>
            </div>
          </div>

          {staff.map((item) => (
            <div
              key={item.id}
              className="rounded-[22px] border border-[#EFEAE7] bg-white p-4 shadow-[0_10px_28px_rgba(39,19,16,0.04)]"
            >
              <div className="flex gap-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random`}
                  alt={item.name}
                  className="h-[64px] w-[64px] shrink-0 rounded-[18px] object-cover"
                />

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[#8B807D]">
                        {item.id}
                      </p>
                      <h3 className="truncate text-[16px] font-extrabold">
                        {item.name}
                      </h3>
                      <p className="truncate text-[12px] font-medium text-[#5A4A47]">
                        {item.email}
                      </p>
                    </div>
                    <RoleBadge item={item} />
                  </div>

                  <p className="mb-4 text-[12px] font-medium text-[#5A4A47]">
                    Registered: {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex h-10 items-center justify-center gap-2 rounded-[12px] border border-[#ECE8E6] bg-[#FAFAF9] text-[12px] font-extrabold text-[#271310]"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex h-10 items-center justify-center gap-2 rounded-[12px] border border-[#F3DEDE] bg-[#FFF8F8] text-[12px] font-extrabold text-[#B42318]"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <PaginationFooter data={staffs} mobile />
        </div>

        <div className="rounded-[24px] bg-[#3A1D18] p-6 text-white shadow-[0_18px_42px_rgba(39,19,16,0.16)] md:rounded-[34px] md:p-12">
          <p className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#DDEED8] md:mb-6">
            Workspace Optimization
          </p>
          <h2 className="text-[17px] font-extrabold">
            Analyze Shift Performance with AI Insights
          </h2>
          <p className="mt-5 max-w-[610px] text-[13px] leading-relaxed text-white/45 md:mt-8 md:text-[15px]">
            Identify your peak hours and staff efficiently. Our new AI Analytics
            module helps you predict footfall and coffee orders with 94%
            accuracy.
          </p>
          <button className="mt-6 h-11 rounded-[10px] bg-[#DDEED8] px-6 text-[12px] font-extrabold text-[#271310] md:mt-8 md:h-12 md:px-8 md:text-[13px]">
            Launch Analytics
          </button>
        </div>
      </section>
    </AdminLayout>
  );
}

function StatBox({
  title,
  value,
  desc,
}: {
  title: string;
  value: string;
  desc: string;
}) {
  return (
    <div className="rounded-[22px] bg-[#FAFAF9] p-5 shadow-[0_10px_28px_rgba(39,19,16,0.03)] md:p-6">
      <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#5A4A47] md:text-[12px]">
        {title}
      </p>
      <h2 className="text-[30px] font-extrabold leading-none md:text-[32px]">
        {value}
      </h2>
      <p className="mt-5 text-[12px] font-semibold text-[#53664F]">{desc}</p>
    </div>
  );
}

function RosterHeader() {
  return (
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
  );
}

function StaffIdentity({ item }: { item: any }) {
  return (
    <div className="flex items-center gap-4">
      <img
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random`}
        alt={item.name}
        className="h-10 w-10 rounded-[10px] object-cover"
      />
      <div>
        <p className="text-[14px] font-extrabold">{item.name}</p>
        <p className="text-[12px] font-medium text-[#5A4A47]">{item.email}</p>
      </div>
    </div>
  );
}

function RoleBadge({ item }: { item: any }) {
  return (
    <div>
      <span
        className={`inline-flex rounded-full px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.08em] md:px-4 md:text-[10px] ${
          item.role === "admin"
            ? "bg-[#FFE3A7] text-[#8C651C]"
            : "bg-[#DDEED8] text-[#60765D]"
        }`}
      >
        {item.role}
      </span>
    </div>
  );
}

function ActionButtons({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex justify-center gap-2">
      <button
        onClick={onEdit}
        className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#ECE8E6] bg-white text-[#5A4A47] transition hover:bg-[#F5F4F3] hover:text-[#271310]"
      >
        <Pencil size={15} strokeWidth={2.4} />
      </button>

      <button
        onClick={onDelete}
        className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#F3DEDE] bg-[#FFF8F8] text-[#B42318] transition hover:bg-[#FDECEC]"
      >
        <Trash2 size={15} strokeWidth={2.4} />
      </button>
    </div>
  );
}

function PaginationFooter({ data, mobile = false }: { data: any, mobile?: boolean }) {
  if (!data || !data.links) return null;

  return (
    <div
      className={[
        "flex items-center justify-between border-t border-[#F0ECEA]",
        mobile ? "border-0 px-1 py-3" : "px-8 py-6",
      ].join(" ")}
    >
      <p className="text-[12px] font-medium text-[#5A4A47] md:text-[13px]">
        Showing {data.from || 0} to {data.to || 0} of {data.total || 0} staff
      </p>

      <div className="flex items-center gap-1 md:gap-2">
        {data.links.map((link: any, index: number) => {
          let label = link.label;
          if (String(label).includes("Previous")) label = <ChevronLeft size={17} />;
          if (String(label).includes("Next")) label = <ChevronRight size={17} />;

          return link.url ? (
            <Link
              key={index}
              href={link.url}
              className={`flex h-9 w-9 items-center justify-center rounded-[10px] text-[13px] font-semibold transition md:h-10 md:w-10 ${
                link.active
                  ? "bg-[#301713] text-white"
                  : "border border-[#E8E3E1] bg-white text-[#5A4A47] hover:bg-[#F4F4F3]"
              }`}
            >
              {typeof label === "string" ? (
                <span dangerouslySetInnerHTML={{ __html: label }} />
              ) : (
                label
              )}
            </Link>
          ) : (
            <span
              key={index}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E8E3E1] bg-white/50 text-[13px] font-semibold text-[#A69D9A] opacity-50 md:h-10 md:w-10"
            >
              {typeof label === "string" ? (
                <span dangerouslySetInnerHTML={{ __html: label }} />
              ) : (
                label
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}