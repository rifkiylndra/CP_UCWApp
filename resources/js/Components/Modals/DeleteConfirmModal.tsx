import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  title = "Delete Confirmation",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] overflow-y-auto bg-black/20 backdrop-blur-[10px]">
      <div className="flex min-h-full items-center justify-center p-4 md:p-8">
        <div className="relative w-full max-w-[460px] rounded-[28px] bg-white p-6 shadow-[0_30px_90px_rgba(39,19,16,0.18)] md:rounded-[32px] md:p-8">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F4F3] text-[#271310] transition hover:bg-[#ECE8E6] disabled:opacity-50"
          >
            <X size={18} />
          </button>

          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF2F1] text-[#B42318]">
            <AlertTriangle size={24} />
          </div>

          <h2 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#271310]">
            {title}
          </h2>

          <p className="mt-3 text-[14px] leading-relaxed text-[#5A4A47] md:text-[15px]">
            {message}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex h-12 items-center justify-center rounded-[14px] border border-[#ECE8E6] text-[14px] font-extrabold text-[#271310] transition hover:bg-[#F8F7F6] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex h-12 items-center justify-center rounded-[14px] bg-[#B42318] text-[14px] font-extrabold text-white transition hover:bg-[#9E1F15] disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
