import React, { FormEvent, useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Camera, ChevronDown, X } from "lucide-react";

interface MenuModalProps {
  open: boolean;
  onClose: () => void;
  editData?: any | null;
}

export default function MenuModal({ open, onClose, editData }: MenuModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data, setData, post, processing, reset } = useForm({
    name: "",
    category: "Espresso Based",
    price: "",
    description: "",
    isAvailable: true,
    image: null as File | null,
  });

  // ✅ Isi form saat edit, kosongkan saat add
  useEffect(() => {
    if (!open) return;

    if (editData) {
      setData({
        name: editData.name || "",
        category: editData.category || "Espresso Based",
        price: editData.price || "",
        description: editData.desc || "",
        isAvailable: editData.available ?? true,
        image: null,
      });
      setImagePreview(editData.img || null);
    } else {
      reset();
      setImagePreview(null);
    }
  }, [open, editData]);

  if (!open) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData("image", file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
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
      console.warn("Route belum terdaftar. Menutup modal sebagai aksi dummy.");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/10 px-4 backdrop-blur-[10px]">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative flex w-full max-w-[670px] overflow-hidden rounded-[38px] bg-white shadow-[0_30px_80px_rgba(39,19,16,0.18)]">

        {/* ── Kiri: Dekoratif + Upload Gambar ── */}
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

            {/* ✅ Upload gambar di panel kiri */}
            <label className="group relative mt-4 block cursor-pointer overflow-hidden rounded-[18px] border-2 border-dashed border-white/20 bg-white/10 transition hover:bg-white/15">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-[160px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera size={22} className="mb-1 text-white" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-white">
                      Change
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex h-[160px] flex-col items-center justify-center gap-2 p-4 text-center">
                  <Camera size={28} className="text-white/50" />
                  <span className="text-[12px] font-bold text-white/70">
                    Upload product image
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-white/40">
                    PNG, JPG up to 10MB
                  </span>
                </div>
              )}
            </label>

            <div className="flex items-center gap-3 text-[13px] text-white/60">
              <span className="h-[4px] w-10 rounded-full bg-[#E8C06B]" />
              Unand Signature Series
            </div>
          </div>
        </div>

        {/* ── Kanan: Form ── */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <div className="flex items-start justify-between px-10 pt-10">
            <div>
              <h2 className="text-[24px] font-extrabold text-[#271310]">
                {editData ? "Edit Menu" : "Add New Menu"}
              </h2>
              <p className="mt-1 text-[15px] text-[#7E716D]">
                Define your next masterpiece.
              </p>
            </div>
            <button onClick={onClose} className="text-[#271310] transition hover:opacity-60">
              <X size={24} />
            </button>
          </div>

          {/* Upload mobile (hanya tampil di bawah md) */}
          <label className="group relative mx-10 mt-6 block cursor-pointer overflow-hidden rounded-[16px] border-2 border-dashed border-[#ECE8E6] bg-[#FCFCFB] md:hidden">
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="h-[140px] w-full object-cover" />
            ) : (
              <div className="flex h-[100px] flex-col items-center justify-center gap-2 p-4 text-center">
                <Camera size={24} className="text-[#C8A96E]" />
                <span className="text-[12px] font-bold text-[#1A1208]">Upload product image</span>
              </div>
            )}
          </label>

          {/* Form Fields */}
          <form id="menuForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-10 py-6">
            <div className="grid grid-cols-2 gap-5">
              {/* Item Name */}
              <div>
                <label className="mb-3 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#6F625F]">
                  Item Name
                </label>
                <input
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="e.g. Smoked Vanilla Latte"
                  className="h-14 w-full rounded-[14px] border border-[#ECE8E6] bg-[#FAFAF9] px-4 text-[15px] outline-none focus:ring-2 focus:ring-[#301713]/10"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-3 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#6F625F]">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={data.category}
                    onChange={(e) => setData("category", e.target.value)}
                    className="h-14 w-full appearance-none rounded-[14px] border border-[#ECE8E6] bg-[#FAFAF9] px-4 pr-10 text-[15px] outline-none focus:ring-2 focus:ring-[#301713]/10"
                  >
                    <option>Espresso Based</option>
                    <option>Milk Based</option>
                    <option>Cold Brews</option>
                    <option>Botanicals</option>
                    <option>Bakery</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#5A4A47]"
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="mb-3 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#6F625F]">
                  Price (IDR)
                </label>
                <input
                  type="number"
                  value={data.price}
                  onChange={(e) => setData("price", e.target.value)}
                  placeholder="Rp 45.000"
                  className="h-14 w-full rounded-[14px] border border-[#ECE8E6] bg-[#FAFAF9] px-4 text-[15px] outline-none focus:ring-2 focus:ring-[#301713]/10"
                  required
                />
              </div>

              {/* Availability */}
              <div>
                <label className="mb-3 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#6F625F]">
                  Availability
                </label>
                <div className="flex h-14 items-center justify-between rounded-[14px] border border-[#ECE8E6] bg-[#FAFAF9] px-4">
                  <span className="text-[15px] font-medium text-[#271310]">
                    {data.isAvailable ? "Available" : "Unavailable"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setData("isAvailable", !data.isAvailable)}
                    className={`flex h-7 w-12 items-center rounded-full p-1 transition ${
                      data.isAvailable ? "bg-[#60765D]" : "bg-[#E5E5E3]"
                    }`}
                  >
                    <span
                      className={`h-5 w-5 rounded-full bg-white transition-transform ${
                        data.isAvailable ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-5">
              <label className="mb-3 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#6F625F]">
                Description
              </label>
              <textarea
                rows={4}
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                placeholder="Describe the flavor notes, origin, and texture..."
                className="w-full rounded-[16px] border border-[#ECE8E6] bg-[#FAFAF9] p-4 text-[15px] outline-none focus:ring-2 focus:ring-[#301713]/10"
              />
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-5 px-10 py-6 border-t border-[#F0ECEA]">
            <button
              type="button"
              onClick={onClose}
              className="text-[16px] font-bold text-[#271310] transition hover:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="menuForm"
              disabled={processing}
              className="h-12 rounded-[14px] bg-[#301713] px-10 text-[15px] font-extrabold text-white shadow-[0_14px_28px_rgba(39,19,16,0.18)] transition hover:bg-black active:scale-[0.98] disabled:opacity-50"
            >
              {processing ? "Saving..." : editData ? "Save Changes" : "Save Menu"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}