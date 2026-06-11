import React, { useMemo, useState } from "react";
import { router } from "@inertiajs/react";
import AdminLayout from "@/Components/Layout/AdminLayout";
import type { AdminUser } from "@/types/admin";
import ActionButtons from "@/Components/admin/ActionButtons";
import DataToolbar from "@/Components/admin/DataToolbar";
import PaginationFooter from "@/Components/admin/PaginationFooter";
import { formatDate } from "@/lib/formatters";
import type { Paginated, SelectOption } from "@/types/shared";
import AddUserModal from "@/Components/Modals/AddAdminModal";
import DeleteConfirmModal from "@/Components/Modals/DeleteConfirmModal";
import { useModalState } from "@/hooks/useModalState";
import {
  UserPlus,
  ShieldPlus,
  Filter,
  Download,
} from "lucide-react";

interface StaffIndexProps {
  auth: { user: AdminUser };
  staffs: Paginated<StaffMember>;
  filters?: {
    role?: string;
  };
}

interface StaffMember {
  id: string | number;
  name: string;
  email?: string;
  username?: string;
  role: string;
  avatar?: string | null;
  created_at?: string;
}

const ROLE_FILTER_OPTIONS: SelectOption[] = [
  { value: "all", label: "All Users" },
  { value: "staff", label: "Staff Only" },
  { value: "admin", label: "Admin Only" },
];

export default function StaffIndex({ auth, staffs, filters }: StaffIndexProps) {
  const staffModal = useModalState();
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [modalRole, setModalRole] = useState<"staff" | "admin">("staff");
  const [roleFilter, setRoleFilter] = useState(filters?.role || "all");
  const [userToDelete, setUserToDelete] = useState<StaffMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const users = staffs?.data || [];

  const totalStaff = useMemo(
    () => users.filter((item) => item.role !== "admin").length,
    [users]
  );

  const totalAdmin = useMemo(
    () => users.filter((item) => item.role === "admin").length,
    [users]
  );

  const handleAdd = (role: "staff" | "admin") => {
    setSelectedStaff(null);
    setModalRole(role);
    staffModal.open();
  };

  const handleEdit = (item: StaffMember) => {
    setSelectedStaff(item);
    setModalRole(item.role === "admin" ? "admin" : "staff");
    staffModal.open();
  };

  const handleDelete = (item: StaffMember) => {
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
    } catch {}
  };

  const exportHref = route("admin.staff.export" as any, {
    role: roleFilter === "all" ? undefined : roleFilter,
  });

  return (
    <AdminLayout auth={auth} title="Staff Management" currentRoute="admin.staff">
      <AddUserModal
        isOpen={staffModal.isOpen}
        onClose={staffModal.close}
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

          {users.map((item) => (
            <div
              key={item.id}
              className="grid min-h-[84px] grid-cols-[1.6fr_160px_200px_130px] items-center border-t border-[#F0ECEA] px-8"
            >
              <StaffIdentity item={item} />
              <RoleBadge item={item} />

              <p className="text-[14px] font-medium text-[#5A4A47]">
                {formatDate(item.created_at, "en-US")}
              </p>

              <ActionButtons
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item)}
              />
            </div>
          ))}

          <PaginationFooter
            data={staffs}
            itemLabel="users"
            linkData={{ role: roleFilter === "all" ? undefined : roleFilter }}
            preserveScroll
            preserveState
          />
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

          {users.map((item) => (
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
                    Registered: {formatDate(item.created_at, "en-US")}
                  </p>

                  <ActionButtons
                    variant="labeled"
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item)}
                  />
                </div>
              </div>
            </div>
          ))}

          <PaginationFooter
            data={staffs}
            itemLabel="users"
            mobile
            linkData={{ role: roleFilter === "all" ? undefined : roleFilter }}
            preserveScroll
            preserveState
          />
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
    <DataToolbar
      title="Team Roster"
      filterValue={roleFilter}
      filterOptions={ROLE_FILTER_OPTIONS}
      onFilterChange={onFilterChange}
      exportHref={exportHref}
      exportLabel="Export"
    />
  );
}

function StaffIdentity({ item }: { item: StaffMember }) {
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

function Avatar({ item, size = "sm" }: { item: StaffMember; size?: "sm" | "lg" }) {
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

function RoleBadge({ item }: { item: StaffMember }) {
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
