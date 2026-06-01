import React, { useState } from "react";
import { router, Link } from "@inertiajs/react";
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
  menus: any; // data pagination dari Laravel
  categories: any[];
}

export default function MenuIndex({ auth, menus, categories }: MenuIndexProps) {
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);

  // Pakai data dari prop, fallback ke array kosong kalau belum ada data
  const items = menus?.data || [];

  const handleAdd = () => {
    setEditData(null);
    setOpenModal(true);
  };

  const handleEdit = (menu: any) => {
    setEditData(menu);
    setOpenModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus menu ini?")) {
      router.delete(route("admin.menu.destroy", id as any));
    }
  };

  return (
    <AdminLayout auth={auth} title="Menu Management" currentRoute="admin.menu">
      <MenuModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        editData={editData}
        categories={categories}
      />

      <section className="font-['Manrope'] text-[#271310]">
        <div className="mb-8 flex flex-col gap-6 lg:mb-12 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.26em] text-[#8C651C] md:text-[12px] md:tracking-[0.32em]">
              Curated Collection
            </p>
            <h1 className="text-[30px] font-extrabold tracking-[-1.2px] md:text-[40px] xl:text-[48px] xl:tracking-[-2.4px]">
              Menu Management
            </h1>
            <p className="mt-2 max-w-[620px] text-[14px] leading-relaxed text-[#5A4A47] md:text-[16px]">
              Refine your café's offerings. Manage seasonal roasts, botanical
              infusions, and the signature pastries that define the digital
              morning ritual.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
            <button className="flex h-[54px] items-center justify-center gap-3 rounded-[12px] border border-[#E8E3E1] bg-white px-4 text-[12px] font-extrabold shadow-[0_10px_24px_rgba(39,19,16,0.04)] md:h-[68px] md:w-[170px] md:gap-5 md:text-[14px]">
              <Filter size={17} />
              <span>
                Category <br className="hidden md:block" /> Filter
              </span>
            </button>

            <button
              onClick={handleAdd}
              className="flex h-[54px] items-center justify-center gap-3 rounded-[12px] bg-[#301713] px-4 text-[12px] font-extrabold text-white shadow-[0_16px_30px_rgba(39,19,16,0.18)] md:h-[68px] md:w-[190px] md:gap-4 md:text-[15px]"
            >
              <Plus size={18} />
              <span>
                Add New <br className="hidden md:block" /> Menu
              </span>
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="mb-10 hidden overflow-hidden rounded-[28px] bg-white shadow-[0_18px_45px_rgba(39,19,16,0.06)] lg:block lg:mb-16">
          <div className="grid grid-cols-[120px_1.4fr_170px_130px_160px_120px] bg-[#FAFAF9] px-8 py-6 text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#8B807D]">
            <span>Visual</span>
            <span>Menu Identity</span>
            <span>Collection</span>
            <span>Price Point</span>
            <span>Availability</span>
            <span className="text-center">Actions</span>
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="grid min-h-[110px] grid-cols-[120px_1.4fr_170px_130px_160px_120px] items-center border-t border-[#F0ECEA] px-8"
            >
              <img
                src={item.image_url || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=120&auto=format&fit=crop"}
                alt={item.name}
                className="h-16 w-16 rounded-[16px] object-cover"
              />

              <div>
                <h3 className="max-w-[240px] text-[17px] font-extrabold leading-tight">
                  {item.name}
                </h3>
                <p className="mt-1 text-[13px] font-medium text-[#5A4A47]">
                  {item.description}
                </p>
              </div>

              <CategoryBadge item={item} />

              <p className="text-[15px] font-extrabold">Rp {Number(item.price).toLocaleString('id-ID')}</p>

              <AvailabilityToggle available={item.is_available} />

              <ActionButtons
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item.id)}
              />
            </div>
          ))}

          <PaginationFooter data={menus} />
        </div>

        {/* Mobile Card List */}
        <div className="mb-10 space-y-4 lg:hidden">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-[22px] border border-[#EFEAE7] bg-white p-4 shadow-[0_10px_28px_rgba(39,19,16,0.04)]"
            >
              <div className="flex gap-4">
                <img
                  src={item.image_url || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=120&auto=format&fit=crop"}
                  alt={item.name}
                  className="h-[82px] w-[82px] shrink-0 rounded-[18px] object-cover"
                />

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-[16px] font-extrabold leading-tight">
                        {item.name}
                      </h3>
                      <p className="mt-1 line-clamp-1 text-[12px] font-medium text-[#5A4A47]">
                        {item.description}
                      </p>
                    </div>

                    <p className="shrink-0 text-[15px] font-extrabold">
                      Rp {Number(item.price).toLocaleString('id-ID')}
                    </p>
                  </div>

                  <div className="mb-4 flex items-center justify-between gap-3">
                    <CategoryBadge item={item} />
                    <AvailabilityToggle available={item.is_available} />
                  </div>

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

          <PaginationFooter data={menus} mobile />
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 gap-4 pb-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <div className="rounded-[22px] bg-[#DDEED8] p-6 lg:min-h-[188px] lg:rounded-[28px] lg:p-8">
            <TrendingUp size={26} className="text-[#60765D]" />
            <h2 className="mt-7 text-[38px] font-extrabold tracking-[-1px] lg:mt-10 lg:text-[52px] lg:tracking-[-2px]">
              84%
            </h2>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#60765D] lg:text-[13px]">
              Active Availability
            </p>
          </div>

          <div className="rounded-[22px] border border-[#E8E3E1] bg-[#FAFAF9] p-6 lg:min-h-[188px] lg:rounded-[28px] lg:p-8">
            <Utensils size={26} />
            <h2 className="mt-7 text-[38px] font-extrabold tracking-[-1px] lg:mt-10 lg:text-[52px] lg:tracking-[-2px]">
              12
            </h2>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#5A4A47] lg:text-[13px]">
              New Seasonal Items
            </p>
          </div>

          <div className="rounded-[22px] bg-[#301713] p-6 text-white shadow-[0_16px_32px_rgba(39,19,16,0.18)] sm:col-span-2 lg:col-span-1 lg:min-h-[188px] lg:rounded-[28px] lg:p-8">
            <Star size={26} className="text-[#FFE3A7]" />
            <h2 className="mt-7 text-[38px] font-extrabold tracking-[-1px] lg:mt-10 lg:text-[52px] lg:tracking-[-2px]">
              4.9
            </h2>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/55 lg:text-[13px]">
              Menu Popularity Score
            </p>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

function CategoryBadge({ item }: { item: any }) {
  // Gunakan category.name atau category_id jika direlasi
  const categoryName = item.category?.name || "Unknown";
  
  return (
    <div>
      <span
        className={`inline-flex rounded-full px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.08em] md:px-4 md:text-[10px] ${
          categoryName.includes("Bakery") || item.color === "yellow"
            ? "bg-[#FFE3A7] text-[#8C651C]"
            : "bg-[#DDEED8] text-[#60765D]"
        }`}
      >
        {categoryName}
      </span>
    </div>
  );
}

function AvailabilityToggle({ available }: { available: boolean }) {
  return (
    <button
      className={`flex h-6 w-11 items-center rounded-full p-0.5 transition ${
        available ? "bg-[#60765D]" : "bg-[#E5E5E3]"
      }`}
    >
      <span
        className={`h-5 w-5 rounded-full bg-white transition ${
          available ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
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
        Showing {data.from || 0}–{data.to || 0} of {data.total || 0} items
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