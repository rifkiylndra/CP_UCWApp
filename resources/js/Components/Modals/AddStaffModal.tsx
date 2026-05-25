import React, { FormEvent, useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Badge, ChevronDown, Eye, X } from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  email?: string;
  username?: string;
  role: string;
}

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffToEdit?: StaffMember | null;
}

export default function AddStaffModal({
  isOpen,
  onClose,
  staffToEdit,
}: AddStaffModalProps) {
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, put, processing, reset } = useForm({
    name: "",
    username: "",
    role: "Senior Barista",
    password: "",
  });

  useEffect(() => {
    if (!isOpen) return;

    if (staffToEdit) {
      setData({
        name: staffToEdit.name || "",
        username: staffToEdit.username || staffToEdit.email?.split("@")[0] || "",
        role: staffToEdit.role || "Senior Barista",
        password: "",
      });
    } else {
      reset();
      setData("role", "Senior Barista");
    }

    setShowPassword(false);
  }, [isOpen, staffToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    try {
      if (staffToEdit) {
        put(route("admin.staff.update" as any, staffToEdit.id as any), {
          onSuccess: () => onClose(),
        });
      } else {
        post(route("admin.staff.store" as any), {
          onSuccess: () => onClose(),
        });
      }
    } catch {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/10 px-4 backdrop-blur-[10px]">
      <div className="relative w-full max-w-[512px] rounded-[32px] bg-[#F6F5F3] px-10 py-11 shadow-[0_30px_90px_rgba(39,19,16,0.22)]">
        <button
          onClick={onClose}
          className="absolute right-9 top-11 z-10 text-[#4A403C] transition hover:text-[#271310]"
        >
          <X size={22} strokeWidth={2.4} />
        </button>

        <Badge
          size={112}
          strokeWidth={1.1}
          className="pointer-events-none absolute right-9 top-7 text-[#E9E7E5]"
        />

        <div className="relative z-10 mb-7">
          <h2 className="text-[29px] font-extrabold tracking-[-1.1px] text-[#271310]">
            {staffToEdit ? "Edit Staff" : "Register New Staff"}
          </h2>
          <p className="mt-2 text-[15px] font-medium text-[#5A4A47]">
            {staffToEdit
              ? "Update artisan profile for the workspace."
              : "Initialize a new artisan profile for the workspace."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <div>
            <label className="mb-3 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#271310]">
              Full Name
            </label>
            <input
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              placeholder="e.g. Sebastian Vael"
              className="h-[55px] w-full rounded-[12px] border-0 bg-white px-5 text-[15px] font-medium text-[#271310] placeholder:text-[#BDB6B3] focus:outline-none focus:ring-2 focus:ring-[#301713]/10"
              required
            />
          </div>

          <div>
            <label className="mb-3 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#271310]">
              Username
            </label>
            <input
              value={data.username}
              onChange={(e) => setData("username", e.target.value)}
              placeholder="barista.sebastian"
              className="h-[55px] w-full rounded-[12px] border-0 bg-white px-5 text-[15px] font-medium text-[#271310] placeholder:text-[#BDB6B3] focus:outline-none focus:ring-2 focus:ring-[#301713]/10"
              required
            />
          </div>

          <div>
            <label className="mb-3 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#271310]">
              Role Selection
            </label>
            <div className="relative">
              <select
                value={data.role}
                onChange={(e) => setData("role", e.target.value)}
                className="h-[57px] w-full appearance-none rounded-[12px] border-0 bg-white px-5 pr-12 text-[15px] font-medium text-[#271310] focus:outline-none focus:ring-2 focus:ring-[#301713]/10"
              >
                <option>Senior Barista</option>
                <option>Head Barista</option>
                <option>Barista</option>
                <option>Cashier</option>
                <option>Manager</option>
              </select>

              <ChevronDown
                size={22}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#5A4A47]"
              />
            </div>
          </div>

          <div>
            <label className="mb-3 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#271310]">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                placeholder="••••••••••••"
                className="h-[55px] w-full rounded-[12px] border-0 bg-white px-5 pr-12 text-[15px] font-medium text-[#271310] placeholder:text-[#BDB6B3] focus:outline-none focus:ring-2 focus:ring-[#301713]/10"
                required={!staffToEdit}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5A4A47]"
              >
                <Eye size={19} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="h-[53px] rounded-[12px] border border-[#E2DEDB] bg-white text-[13px] font-extrabold uppercase tracking-[0.16em] text-[#271310] transition hover:bg-[#F9F9F8]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={processing}
              className="h-[53px] rounded-[12px] bg-gradient-to-r from-[#301713] to-[#5B4239] text-[13px] font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_14px_24px_rgba(39,19,16,0.18)] transition active:scale-[0.98] disabled:opacity-60"
            >
              {processing
                ? "Saving..."
                : staffToEdit
                  ? "Save Changes"
                  : "Save Staff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}