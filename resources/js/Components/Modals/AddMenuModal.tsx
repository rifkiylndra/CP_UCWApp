import React, { FormEvent, useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Camera, ChevronDown, X } from "lucide-react";

interface MenuModalProps {
  open: boolean;
  onClose: () => void;
  editData?: any | null;
  categories?: any[];
}

export default function MenuModal({ open, onClose, editData, categories = [] }: MenuModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data, setData, post, processing, reset, errors } = useForm({
    name: "",
    category_id: "",
    price: "",
    description: "",
    is_available: true,
    image: null as File | null,
  });

  useEffect(() => {
    if (!open) return;

    if (editData) {
      setData({
        name: editData.name || "",
        category_id: editData.category_id || (categories[0]?.id || ""),
        price: editData.price || "",
        description: editData.description || "",
        is_available: editData.is_available ?? true,
        image: null,
      });
      setImagePreview(editData.image_url || null);
    } else {
      reset();
      setData("category_id", categories[0]?.id || "");
      setImagePreview(null);
    }
  }, [open, editData, categories]);

  if (!open) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setData("image", file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    try {
      if (editData) {
        post(route("admin.menu.update" as any, editData.id as any), {
          data: { ...data, _method: "put" },
          onSuccess: () => onClose(),
        });
      } else {
        post(route("admin.menu.store" as any), {
          onSuccess: () => onClose(),
        });
      }
    } catch {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/20 px-0 backdrop-blur-[10px] md:items-center md:px-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative flex max-h-[94vh] w-full overflow-hidden rounded-t-[30px] bg-white shadow-[0_30px_80px_rgba(39,19,16,0.18)] md:max-w-[670px] md:rounded-[38px]">
        <div className="relative hidden w-[42%] bg-[#301713] md:block">
          <img
            src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
            alt=""
          />

          <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.4em] text-white/45">
                Barista Standard
              </p>
              <h2 className="mt-8 text-[28px] font-bold leading-tight text-[#D5B1A8]">
                Crafting the perfect ritual.
              </h2>
            </div>

            <UploadBox
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
              dark
            />
            {errors.image && <p className="mt-1 text-center text-[11px] text-red-400">{errors.image}</p>}

            <div className="flex items-center gap-3 text-[13px] text-white/60">
              <span className="h-[4px] w-10 rounded-full bg-[#E8C06B]" />
              Unand Signature Series
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-start justify-between px-5 pt-6 md:px-10 md:pt-10">
            <div>
              <h2 className="text-[22px] font-extrabold text-[#271310] md:text-[24px]">
                {editData ? "Edit Menu" : "Add New Menu"}
              </h2>
              <p className="mt-1 text-[13px] text-[#7E716D] md:text-[15px]">
                Define your next masterpiece.
              </p>
            </div>

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F4F3] text-[#271310] transition hover:opacity-60 md:bg-transparent"
            >
              <X size={22} />
            </button>
          </div>

          <div className="px-5 md:hidden">
            <UploadBox
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
            />
            {errors.image && <p className="mt-2 text-center text-[11px] text-red-500">{errors.image}</p>}
          </div>

          <form
            id="menuForm"
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-5 py-5 md:px-10 md:py-6"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
              <Field label="Item Name">
                <input
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="e.g. Smoked Vanilla Latte"
                  className="h-12 w-full rounded-[14px] border border-[#ECE8E6] bg-[#FAFAF9] px-4 text-[14px] outline-none focus:ring-2 focus:ring-[#301713]/10 md:h-14 md:text-[15px]"
                  required
                />
              </Field>

              <Field label="Category">
                <div className="relative">
                  <select
                    value={data.category_id}
                    onChange={(e) => setData("category_id", e.target.value)}
                    className="h-12 w-full appearance-none rounded-[14px] border border-[#ECE8E6] bg-[#FAFAF9] px-4 pr-10 text-[14px] outline-none focus:ring-2 focus:ring-[#301713]/10 md:h-14 md:text-[15px]"
                  >
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#5A4A47]"
                  />
                </div>
                {errors.category_id && <p className="mt-1 text-[11px] text-red-500">{errors.category_id}</p>}
              </Field>

              <Field label="Price (IDR)">
                <input
                  type="number"
                  value={data.price}
                  onChange={(e) => setData("price", e.target.value)}
                  placeholder="Rp 45.000"
                  className="h-12 w-full rounded-[14px] border border-[#ECE8E6] bg-[#FAFAF9] px-4 text-[14px] outline-none focus:ring-2 focus:ring-[#301713]/10 md:h-14 md:text-[15px]"
                  required
                />
                {errors.price && <p className="mt-1 text-[11px] text-red-500">{errors.price}</p>}
              </Field>

              <Field label="Availability">
                <div className="flex h-12 items-center justify-between rounded-[14px] border border-[#ECE8E6] bg-[#FAFAF9] px-4 md:h-14">
                  <span className="text-[14px] font-medium text-[#271310] md:text-[15px]">
                    {data.is_available ? "Available" : "Unavailable"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setData("is_available", !data.is_available)}
                    className={`flex h-7 w-12 items-center rounded-full p-1 transition ${
                      data.is_available ? "bg-[#60765D]" : "bg-[#E5E5E3]"
                    }`}
                  >
                    <span
                      className={`h-5 w-5 rounded-full bg-white transition-transform ${
                        data.is_available ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                    </button>
                  </div>
                  {errors.is_available && <p className="mt-1 text-[11px] text-red-500">{errors.is_available}</p>}
                </Field>
            </div>

            <div className="mt-4 md:mt-5">
              <Field label="Description">
                <textarea
                  rows={4}
                  value={data.description}
                  onChange={(e) => setData("description", e.target.value)}
                  placeholder="Describe the flavor notes, origin, and texture..."
                  className="w-full rounded-[16px] border border-[#ECE8E6] bg-[#FAFAF9] p-4 text-[14px] outline-none focus:ring-2 focus:ring-[#301713]/10 md:text-[15px]"
                />
                {errors.description && <p className="mt-1 text-[11px] text-red-500">{errors.description}</p>}
              </Field>
            </div>
          </form>

          <div className="grid grid-cols-2 gap-3 border-t border-[#F0ECEA] px-5 py-4 md:flex md:items-center md:justify-end md:gap-5 md:px-10 md:py-6">
            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-[14px] border border-[#ECE8E6] text-[13px] font-extrabold text-[#271310] transition hover:opacity-60 md:border-0 md:px-2 md:text-[16px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="menuForm"
              disabled={processing}
              className="h-12 rounded-[14px] bg-[#301713] px-5 text-[13px] font-extrabold text-white shadow-[0_14px_28px_rgba(39,19,16,0.18)] transition hover:bg-black active:scale-[0.98] disabled:opacity-50 md:px-10 md:text-[15px]"
            >
              {processing ? "Saving..." : editData ? "Save Changes" : "Save Menu"}
            </button>
          </div>
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
      <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#6F625F] md:mb-3 md:text-[11px] md:tracking-[0.18em]">
        {label}
      </label>
      {children}
    </div>
  );
}

function UploadBox({
  imagePreview,
  onImageChange,
  dark = false,
}: {
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dark?: boolean;
}) {
  return (
    <label
      className={[
        "group relative mt-5 block cursor-pointer overflow-hidden rounded-[18px] border-2 border-dashed transition",
        dark
          ? "border-white/20 bg-white/10 hover:bg-white/15"
          : "border-[#ECE8E6] bg-[#FCFCFB]",
      ].join(" ")}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onImageChange}
      />

      {imagePreview ? (
        <>
          <img
            src={imagePreview}
            alt="Preview"
            className="h-[120px] w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-[160px]"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera size={22} className="mb-1 text-white" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-white">
              Change
            </span>
          </div>
        </>
      ) : (
        <div className="flex h-[100px] flex-col items-center justify-center gap-2 p-4 text-center md:h-[160px]">
          <Camera size={26} className={dark ? "text-white/50" : "text-[#C8A96E]"} />
          <span
            className={`text-[12px] font-bold ${
              dark ? "text-white/70" : "text-[#271310]"
            }`}
          >
            Upload product image
          </span>
          <span
            className={`text-[9px] uppercase tracking-widest ${
              dark ? "text-white/40" : "text-[#A69D9A]"
            }`}
          >
            PNG, JPG up to 10MB
          </span>
        </div>
      )}
    </label>
  );
}