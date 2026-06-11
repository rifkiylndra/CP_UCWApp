import React, { useState } from "react";
import { router } from "@inertiajs/react";
import AdminLayout from "@/Components/Layout/AdminLayout";
import type { AdminUser } from "@/types/admin";
import ActionButtons from "@/Components/admin/ActionButtons";
import PaginationFooter from "@/Components/admin/PaginationFooter";
import { firstImageUrl, MENU_IMAGE_PLACEHOLDER, useFallbackImage } from "@/lib/images";
import { formatIDR } from "@/lib/formatters";
import type { Nullable, Paginated } from "@/types/shared";
import MenuModal from "@/Components/Modals/AddMenuModal";
import MenuCategoryModal from "@/Components/Modals/MenuCategoryModal";
import DeleteConfirmModal from "@/Components/Modals/DeleteConfirmModal";
import { Plus, Utensils } from "lucide-react";

interface MenuIndexProps {
    auth: { user: AdminUser };
    menus: Paginated<MenuItem>;
    categories: MenuCategory[];
}

interface MenuCategory {
    id: string | number;
    name: string;
}

interface MenuItem {
    id: string | number;
    name: string;
    description?: string;
    price: number | string;
    category_id?: string | number;
    category?: MenuCategory | null;
    image?: string | null;
    image_url?: string | null;
    imageUrl?: string | null;
    is_available: boolean;
    color?: string;
    estimated_time?: number | string;
}

export default function MenuIndex({ auth, menus, categories }: MenuIndexProps) {
    const [openModal, setOpenModal] = useState(false);
    const [editData, setEditData] = useState<Nullable<MenuItem>>(null);
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const [menuToDelete, setMenuToDelete] = useState<Nullable<MenuItem>>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const items = menus?.data || [];

    const handleAdd = () => {
        setEditData(null);
        setOpenModal(true);
    };

    const handleEdit = (menu: MenuItem) => {
        setEditData(menu);
        setOpenModal(true);
    };

    const handleDelete = (menu: MenuItem) => {
        setMenuToDelete(menu);
    };

    const handleCloseDeleteModal = () => {
        if (isDeleting) return;

        setMenuToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (!menuToDelete) return;

        setIsDeleting(true);

        router.delete(route("admin.menu.destroy", menuToDelete.id as any), {
            onSuccess: () => {
                setMenuToDelete(null);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <AdminLayout auth={auth} title="Menu Management" currentRoute="admin.menu">
            <MenuModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                editData={editData}
                categories={categories}
            />
            <MenuCategoryModal
                open={openCategoryModal}
                onClose={() => setOpenCategoryModal(false)}
                categories={categories}
            />
            <DeleteConfirmModal
                isOpen={Boolean(menuToDelete)}
                title="Delete Confirmation"
                message={`Are you sure you want to delete "${menuToDelete?.name ?? "this menu"}"? This action cannot be undone.`}
                isDeleting={isDeleting}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
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
                            Refine your cafÃ©'s offerings. Manage seasonal
                            roasts, botanical infusions, and the signature
                            pastries that define the digital morning ritual.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
                        <button
                            type="button"
                            onClick={() => setOpenCategoryModal(true)}
                            className="flex h-[54px] items-center justify-center gap-3 rounded-[12px] border border-[#E8E3E1] bg-white px-4 text-[12px] font-extrabold shadow-[0_10px_24px_rgba(39,19,16,0.04)] md:h-[68px] md:w-[190px] md:text-[14px]"
                        >
                            <Utensils size={17} />
                            <span>
                                Manage <br className="hidden md:block" />
                                Categories
                            </span>
                        </button>

                        <button
                            type="button"
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
                                src={firstImageUrl(item.image_url, item.imageUrl, item.image) || MENU_IMAGE_PLACEHOLDER}
                                alt={item.name}
                                className="h-16 w-16 rounded-[16px] object-cover"
                                onError={useFallbackImage}
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

                            <p className="text-[15px] font-extrabold">
                                {formatIDR(item.price)}
                            </p>

                            <AvailabilityToggle available={item.is_available} />

                            <ActionButtons
                                onEdit={() => handleEdit(item)}
                                onDelete={() => handleDelete(item)}
                            />
                        </div>
                    ))}

                    <PaginationFooter data={menus} itemLabel="items" compactLinks />
                </div>

                <div className="mb-10 space-y-4 lg:hidden">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-[22px] border border-[#EFEAE7] bg-white p-4 shadow-[0_10px_28px_rgba(39,19,16,0.04)]"
                        >
                            <div className="flex gap-4">
                                <img
                                    src={firstImageUrl(item.image_url, item.imageUrl, item.image) || MENU_IMAGE_PLACEHOLDER}
                                    alt={item.name}
                                    className="h-[82px] w-[82px] shrink-0 rounded-[18px] object-cover"
                                    onError={useFallbackImage}
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
                                            {formatIDR(item.price)}
                                        </p>
                                    </div>

                                    <div className="mb-4 flex items-center justify-between gap-3">
                                        <CategoryBadge item={item} />
                                        <AvailabilityToggle available={item.is_available} />
                                    </div>

                                    <ActionButtons
                                        variant="labeled"
                                        onEdit={() => handleEdit(item)}
                                        onDelete={() => handleDelete(item)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <PaginationFooter data={menus} itemLabel="items" mobile compactLinks />
                </div>
            </section>
        </AdminLayout>
    );
}

function CategoryBadge({ item }: { item: MenuItem }) {
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
            type="button"
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
