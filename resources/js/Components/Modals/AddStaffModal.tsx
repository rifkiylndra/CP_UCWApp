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
    <div className="fixed inset-0 z-[999] overflow-y-auto bg-black/20 backdrop-blur-[10px]">
      <div className="flex min-h-full items-center justify-center p-4 md:p-8">
        <div className="relative max-h-[calc(100vh-32px)] w-full max-w-[512px] overflow-y-auto rounded-[28px] bg-[#F6F5F3] px-5 py-6 shadow-[0_30px_90px_rgba(39,19,16,0.22)] md:max-h-[calc(100vh-64px)] md:rounded-[32px] md:px-10 md:py-11">
          <button
            onClick={onClose}
            className="absolute right-5 top-6 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#4A403C] transition hover:text-[#271310] md:right-9 md:top-11 md:bg-transparent"
          >
            <X size={21} strokeWidth={2.4} />
          </button>

          <Badge
            size={112}
            strokeWidth={1.1}
            className="pointer-events-none absolute right-8 top-7 hidden text-[#E9E7E5] md:block"
          />

          <div className="relative z-10 mb-6 pr-10 md:mb-7 md:pr-0">
            <h2 className="text-[24px] font-extrabold tracking-[-0.8px] text-[#271310] md:text-[29px] md:tracking-[-1.1px]">
              {staffToEdit ? "Edit Staff" : "Register New Staff"}
            </h2>
            <p className="mt-2 text-[13px] font-medium text-[#5A4A47] md:text-[15px]">
              {staffToEdit
                ? "Update artisan profile for the workspace."
                : "Initialize a new artisan profile for the workspace."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-4 md:space-y-6">
            <Field label="Full Name">
              <input
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                placeholder="e.g. Sebastian Vael"
                className="h-12 w-full rounded-[12px] border-0 bg-white px-4 text-[14px] font-medium text-[#271310] placeholder:text-[#BDB6B3] focus:outline-none focus:ring-2 focus:ring-[#301713]/10 md:h-[55px] md:px-5 md:text-[15px]"
                required
              />
            </Field>

            <Field label="Username">
              <input
                value={data.username}
                onChange={(e) => setData("username", e.target.value)}
                placeholder="barista.sebastian"
                className="h-12 w-full rounded-[12px] border-0 bg-white px-4 text-[14px] font-medium text-[#271310] placeholder:text-[#BDB6B3] focus:outline-none focus:ring-2 focus:ring-[#301713]/10 md:h-[55px] md:px-5 md:text-[15px]"
                required
              />
            </Field>

            <Field label="Role Selection">
              <div className="relative">
                <select
                  value={data.role}
                  onChange={(e) => setData("role", e.target.value)}
                  className="h-12 w-full appearance-none rounded-[12px] border-0 bg-white px-4 pr-12 text-[14px] font-medium text-[#271310] focus:outline-none focus:ring-2 focus:ring-[#301713]/10 md:h-[57px] md:px-5 md:text-[15px]"
                >
                  <option>Senior Barista</option>
                  <option>Head Barista</option>
                  <option>Barista</option>
                  <option>Cashier</option>
                  <option>Manager</option>
                </select>

                <ChevronDown
                  size={21}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#5A4A47]"
                />
              </div>
            </Field>

            <Field label="Password">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  placeholder="••••••••••••"
                  className="h-12 w-full rounded-[12px] border-0 bg-white px-4 pr-12 text-[14px] font-medium text-[#271310] placeholder:text-[#BDB6B3] focus:outline-none focus:ring-2 focus:ring-[#301713]/10 md:h-[55px] md:px-5 md:text-[15px]"
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
            </Field>

            <div className="grid grid-cols-2 gap-3 pt-3 md:gap-4 md:pt-5">
              <button
                type="button"
                onClick={onClose}
                className="h-12 rounded-[12px] border border-[#E2DEDB] bg-white text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#271310] transition hover:bg-[#F9F9F8] md:h-[53px] md:text-[13px] md:tracking-[0.16em]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={processing}
                className="h-12 rounded-[12px] bg-gradient-to-r from-[#301713] to-[#5B4239] text-[12px] font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_14px_24px_rgba(39,19,16,0.18)] transition active:scale-[0.98] disabled:opacity-60 md:h-[53px] md:text-[13px] md:tracking-[0.16em]"
              >
                {processing ? "Saving..." : staffToEdit ? "Save Changes" : "Save Staff"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#271310] md:mb-3 md:text-[11px] md:tracking-[0.18em]">
        {label}
      </label>
      {children}
    </div>
  );
}