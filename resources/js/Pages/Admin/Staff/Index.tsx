import React, { useMemo, useState } from "react";
import { router, Link } from "@inertiajs/react";
import AdminLayout from "@/Components/Layout/AdminLayout";
import type { AdminUser } from "@/types/admin";
import AddUserModal from "@/Components/Modals/AddAdminModal";
import DeleteConfirmModal from "@/Components/Modals/DeleteConfirmModal";
import {
  UserPlus,
  ShieldPlus,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";

interface StaffIndexProps {
  auth: { user: AdminUser };
  staffs: any;
  filters?: {
    role?: string;
  };
}

export default function StaffIndex({ auth, staffs, filters }: StaffIndexProps) {
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
  const [modalRole, setModalRole] = useState<"staff" | "admin">("staff");
  const [roleFilter, setRoleFilter] = useState(filters?.role || "all");
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const users = staffs?.data || [];

  const totalStaff = useMemo(
    () => users.filter((item: any) => item.role !== "admin").length,
    [users]
  );

  const totalAdmin = useMemo(
    () => users.filter((item: any) => item.role === "admin").length,
    [users]
  );

  const handleAdd = (role: "staff" | "admin") => {
    setSelectedStaff(null);
    setModalRole(role);
    setIsStaffModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedStaff(item);
    setModalRole(item.role === "admin" ? "admin" : "staff");
    setIsStaffModalOpen(true);
  };

  const handleDelete = (item: any) => {
    setUserToDelete(item);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;

    setUserToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;

    setIsDeleting(true);

    router.delete(route("admin.staff.destroy", userToDelete.id as any), {
      onSuccess: () => {
        setUserToDelete(null);
      },
      onFinish: () => {
        setIsDeleting(false);
      },
    });
  };

  const handleFilterChange = (role: string) => {
    setRoleFilter(role);

    try {
      router.get(
        route("admin.staff" as any),
        { role: role === "all" ? undefined : role },
        {
          preserveScroll: true,
          preserveState: true,
        }
      );
    } catch {
      console.log("Filter role:", role);
    }
  };

  const exportHref = route("admin.staff.export" as any, {
    role: roleFilter === "all" ? undefined : roleFilter,
  });

  return (
    <AdminLayout auth={auth} title="Staff Management" currentRoute="admin.staff">
      <AddUserModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        staffToEdit={selectedStaff}
        defaultRole={modalRole}
      />
      <DeleteConfirmModal
        isOpen={Boolean(userToDelete)}
        title="Delete Confirmation"
        message={`Are you sure you want to delete "${userToDelete?.name ?? "this user"}"? This action cannot be undone.`}
        isDeleting={isDeleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={() => handleAdd("staff")}
              className="flex h-12 items-center justify-center gap-3 rounded-[12px] bg-[#301713] px-7 text-[14px] font-extrabold text-white shadow-[0_14px_28px_rgba(39,19,16,0.16)]"
            >
              <UserPlus size={19} />
              Add New Staff
            </button>

            <button
              onClick={() => handleAdd("admin")}
              className="flex h-12 items-center justify-center gap-3 rounded-[12px] border border-[#E8E3E1] bg-white px-7 text-[14px] font-extrabold text-[#271310] shadow-[0_10px_24px_rgba(39,19,16,0.04)]"
            >
              <ShieldPlus size={19} />
              Add New Admin
            </button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mb-12 lg:gap-6">
          <StatBox title="Total Staff" value={String(totalStaff || 0)} desc="Active staff accounts" />
          <StatBox title="Total Admin" value={String(totalAdmin || 0)} desc="Administrator accounts" />
        </div>

        {/* Desktop Table */}
        <div className="mb-12 hidden overflow-hidden rounded-[28px] bg-white shadow-[0_18px_45px_rgba(39,19,16,0.05)] lg:block">
          <RosterHeader
            roleFilter={roleFilter}
            onFilterChange={handleFilterChange}
            exportHref={exportHref}
          />

          <div className="grid grid-cols-[1.6fr_160px_200px_130px] bg-[#FAFAF9] px-8 py-5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#8B807D]">
            <span>Staff Member</span>
            <span>Role</span>
            <span>Registration Date</span>
            <span className="text-center">Action</span>
          </div>

          {users.map((item: any) => (
            <div
              key={item.id}
              className="grid min-h-[84px] grid-cols-[1.6fr_160px_200px_130px] items-center border-t border-[#F0ECEA] px-8"
            >
              <StaffIdentity item={item} />
              <RoleBadge item={item} />

              <p className="text-[14px] font-medium text-[#5A4A47]">
                {formatDate(item.created_at)}
              </p>

              <ActionButtons
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item)}
              />
            </div>
          ))}

          <PaginationFooter data={staffs} roleFilter={roleFilter} />
        </div>

        {/* Mobile Card List */}
        <div className="mb-10 space-y-4 lg:hidden">
          <div className="rounded-[20px] bg-white px-5 py-4 shadow-[0_10px_28px_rgba(39,19,16,0.04)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[17px] font-extrabold">Team Roster</h2>
              <a href={exportHref} className="text-[#271310]">
                <Download size={18} />
              </a>
            </div>

            <div className="grid grid-cols-[auto_1fr] items-center gap-3">
              <Filter size={17} />
              <select
                value={roleFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="h-10 rounded-[12px] border border-[#ECE8E6] bg-[#FAFAF9] px-3 text-[13px] font-bold text-[#271310] outline-none"
              >
                <option value="all">All Users</option>
                <option value="staff">Staff Only</option>
                <option value="admin">Admin Only</option>
              </select>
            </div>
          </div>

          {users.map((item: any) => (
            <div
              key={item.id}
              className="rounded-[22px] border border-[#EFEAE7] bg-white p-4 shadow-[0_10px_28px_rgba(39,19,16,0.04)]"
            >
              <div className="flex gap-4">
                <Avatar item={item} size="lg" />

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div className="min-w-0">
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
                    Registered: {formatDate(item.created_at)}
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
                      onClick={() => handleDelete(item)}
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

          <PaginationFooter data={staffs} roleFilter={roleFilter} mobile />
        </div>
      </section>
    </AdminLayout>
  );
}

function RosterHeader({
  roleFilter,
  onFilterChange,
  exportHref,
}: {
  roleFilter: string;
  onFilterChange: (role: string) => void;
  exportHref: string;
}) {
  return (
    <div className="flex items-center justify-between px-8 py-8">
      <h2 className="text-[18px] font-extrabold">Team Roster</h2>

      <div className="flex items-center gap-4">
        <div className="flex h-10 items-center gap-2 rounded-[12px] border border-[#ECE8E6] bg-[#FAFAF9] px-3">
          <Filter size={16} />
          <select
            value={roleFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="border-0 bg-transparent text-[13px] font-bold text-[#271310] outline-none focus:ring-0"
          >
            <option value="all">All Users</option>
            <option value="staff">Staff Only</option>
            <option value="admin">Admin Only</option>
          </select>
        </div>

        <a
          href={exportHref}
          className="flex h-10 items-center gap-2 rounded-[12px] bg-[#DDEED8] px-4 text-[13px] font-extrabold text-[#53664F]"
        >
          <Download size={16} />
          Export
        </a>
      </div>
    </div>
  );
}

function StaffIdentity({ item }: { item: any }) {
  return (
    <div className="flex items-center gap-4">
      <Avatar item={item} />
      <div className="min-w-0">
        <p className="truncate text-[14px] font-extrabold">{item.name}</p>
        <p className="truncate text-[12px] font-medium text-[#5A4A47]">
          {item.email}
        </p>
      </div>
    </div>
  );
}

function Avatar({ item, size = "sm" }: { item: any; size?: "sm" | "lg" }) {
  const dimension = size === "lg" ? "h-[64px] w-[64px] rounded-[18px]" : "h-10 w-10 rounded-[10px]";

  return (
    <img
      src={
        item.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || "User")}&background=random`
      }
      alt={item.name}
      className={`${dimension} shrink-0 object-cover`}
    />
  );
}

function RoleBadge({ item }: { item: any }) {
  const isAdmin = item.role === "admin";

  return (
    <div>
      <span
        className={`inline-flex rounded-full px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.08em] md:px-4 md:text-[10px] ${
          isAdmin
            ? "bg-[#FFE3A7] text-[#8C651C]"
            : "bg-[#DDEED8] text-[#60765D]"
        }`}
      >
        {isAdmin ? "Admin" : "Staff"}
      </span>
    </div>
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

function PaginationFooter({
  data,
  roleFilter,
  mobile = false,
}: {
  data: any;
  roleFilter: string;
  mobile?: boolean;
}) {
  if (!data || !data.links) return null;

  return (
    <div
      className={[
        "flex items-center justify-between border-t border-[#F0ECEA]",
        mobile ? "border-0 px-1 py-3" : "px-8 py-6",
      ].join(" ")}
    >
      <p className="text-[12px] font-medium text-[#5A4A47] md:text-[13px]">
        Showing {data.from || 0} to {data.to || 0} of {data.total || 0} users
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
              data={{ role: roleFilter === "all" ? undefined : roleFilter }}
              preserveScroll
              preserveState
              className={`flex h-9 min-w-9 items-center justify-center rounded-[10px] px-3 text-[13px] font-semibold transition md:h-10 ${
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
              className="flex h-9 min-w-9 items-center justify-center rounded-[10px] border border-[#E8E3E1] bg-white/50 px-3 text-[13px] font-semibold text-[#A69D9A] opacity-50 md:h-10"
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

function formatDate(value?: string) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
