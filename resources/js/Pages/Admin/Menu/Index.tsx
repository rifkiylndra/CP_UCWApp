import React, { useState } from "react";
import AdminLayout from "@/Components/Layout/AdminLayout";
import type { AdminUser } from "@/types/admin";
import MenuModal from "@/Components/Modals/AddMenuModal";
import {
  Filter,
  Plus,
  TrendingUp,
  Utensils,
  Star,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";

interface MenuIndexProps {
  auth: { user: AdminUser };
}

export default function MenuIndex({ auth }: MenuIndexProps) {
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);

  const [items] = useState([
    {
      id: "1",
      name: "Midnight Espresso",
      desc: "Signature House Roast • 2oz",
      category: "Espresso Bar",
      price: "$4.50",
      available: true,
      color: "green",
      img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=120&auto=format&fit=crop",
    },
    {
      id: "2",
      name: "Oat Milk Botanical Latte",
      desc: "Lavender-infused • 12oz",
      category: "Botanicals",
      price: "$6.75",
      available: true,
      color: "green",
      img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=120&auto=format&fit=crop",
    },
    {
      id: "3",
      name: "Artisan Butter Croissant",
      desc: "Twice-baked • Seasonal",
      category: "Bakery",
      price: "$5.25",
      available: false,
      color: "yellow",
      img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=120&auto=format&fit=crop",
    },
    {
      id: "4",
      name: "Hibiscus Cold Brew",
      desc: "Single origin Ethiopia • 16oz",
      category: "Cold Brews",
      price: "$5.50",
      available: true,
      color: "green",
      img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=120&auto=format&fit=crop",
    },
  ]);

  const handleEdit = (menu: any) => {
    setEditData(menu);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setEditData(null);
    setOpenModal(true);
  };

  const handleDelete = (id: string) => {
    console.log("Delete menu:", id);
  };

  return (
    <AdminLayout auth={auth} title="Menu Management" currentRoute="admin.menu">
      {/* ✅ Modal diletakkan di dalam return, di luar section */}
      <MenuModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        editData={editData}
      />

      <section className="font-['Manrope'] text-[#271310]">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="mb-2 text-[12px] font-extrabold uppercase tracking-[0.32em] text-[#8C651C]">
              Curated Collection
            </p>
            <h1 className="text-[48px] font-extrabold tracking-[-2.4px]">
              Menu Management
            </h1>
            <p className="mt-2 max-w-[620px] text-[16px] leading-relaxed text-[#5A4A47]">
              Refine your café's offerings. Manage seasonal roasts, botanical
              infusions, and the signature pastries that define the digital
              morning ritual.
            </p>
          </div>

          <div className="flex gap-4">
            <button className="flex h-[68px] w-[170px] items-center justify-center gap-5 rounded-[10px] border border-[#E8E3E1] bg-white text-[14px] font-extrabold shadow-[0_10px_24px_rgba(39,19,16,0.04)]">
              <Filter size={18} />
              <span>
                Category <br /> Filter
              </span>
            </button>

            {/* ✅ onClick terhubung ke handleAdd */}
            <button
              onClick={handleAdd}
              className="flex h-[68px] w-[190px] items-center justify-center gap-4 rounded-[10px] bg-[#301713] text-[15px] font-extrabold text-white shadow-[0_16px_30px_rgba(39,19,16,0.18)]"
            >
              <Plus size={20} />
              <span>
                + Add New <br /> Menu
              </span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mb-16 overflow-hidden rounded-[28px] bg-white shadow-[0_18px_45px_rgba(39,19,16,0.06)]">
          <div className="grid grid-cols-[120px_1.4fr_170px_130px_160px_120px] bg-[#FAFAF9] px-8 py-6 text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#8B807D]">
            <span>Visual</span>
            <span>Menu Identity</span>
            <span>Collection</span>
            <span>Price Point</span>
            <span>Availability</span>
            <span className="text-center">Actions</span>
          </div>

          <div>
            {items.map((item) => (
              <div
                key={item.id}
                className="grid min-h-[110px] grid-cols-[120px_1.4fr_170px_130px_160px_120px] items-center border-t border-[#F0ECEA] px-8"
              >
                <div>
                  <img
                    src={item.img}
                    alt={item.name}
                    className="h-16 w-16 rounded-[16px] object-cover grayscale"
                  />
                </div>

                <div>
                  <h3 className="max-w-[240px] text-[17px] font-extrabold leading-tight">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-[13px] font-medium text-[#5A4A47]">
                    {item.desc}
                  </p>
                </div>

                <div>
                  <span
                    className={`rounded-full px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] ${
                      item.color === "yellow"
                        ? "bg-[#FFE3A7] text-[#8C651C]"
                        : "bg-[#DDEED8] text-[#60765D]"
                    }`}
                  >
                    {item.category}
                  </span>
                </div>

                <p className="text-[15px] font-extrabold">{item.price}</p>

                <div>
                  <button
                    className={`flex h-6 w-11 items-center rounded-full p-0.5 transition ${
                      item.available ? "bg-[#60765D]" : "bg-[#E5E5E3]"
                    }`}
                  >
                    <span
                      className={`h-5 w-5 rounded-full bg-white transition ${
                        item.available ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* ✅ Tombol Edit & Delete yang berfungsi */}
                <div className="flex justify-center gap-2">
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
          </div>

          <div className="flex items-center justify-between border-t border-[#F0ECEA] px-8 py-6">
            <p className="text-[13px] font-medium text-[#5A4A47]">
              Showing 1–4 of 32 artisanal menu items
            </p>

            <div className="flex items-center gap-4">
              <button className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E8E3E1]">
                <ChevronLeft size={18} />
              </button>
              <button className="h-10 w-10 rounded-[10px] bg-[#301713] text-[13px] font-extrabold text-white">
                1
              </button>
              <button className="h-10 w-10 rounded-[10px] text-[13px] font-semibold">
                2
              </button>
              <button className="h-10 w-10 rounded-[10px] text-[13px] font-semibold">
                3
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E8E3E1]">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="min-h-[188px] rounded-[28px] bg-[#DDEED8] p-8">
            <TrendingUp size={28} className="text-[#60765D]" />
            <h2 className="mt-10 text-[52px] font-extrabold tracking-[-2px]">
              84%
            </h2>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-[#60765D]">
              Active Availability
            </p>
          </div>

          <div className="min-h-[188px] rounded-[28px] border border-[#E8E3E1] bg-[#FAFAF9] p-8">
            <Utensils size={28} />
            <h2 className="mt-10 text-[52px] font-extrabold tracking-[-2px]">
              12
            </h2>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-[#5A4A47]">
              New Seasonal Items
            </p>
          </div>

          <div className="min-h-[188px] rounded-[28px] bg-[#301713] p-8 text-white shadow-[0_16px_32px_rgba(39,19,16,0.18)]">
            <Star size={28} className="text-[#FFE3A7]" />
            <h2 className="mt-10 text-[52px] font-extrabold tracking-[-2px]">
              4.9
            </h2>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-white/55">
              Menu Popularity Score
            </p>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}