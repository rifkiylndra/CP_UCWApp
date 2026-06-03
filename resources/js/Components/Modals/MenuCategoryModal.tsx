import React, { FormEvent, useEffect, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import DeleteConfirmModal from "@/Components/Modals/DeleteConfirmModal";

interface MenuCategoryModalProps {
    open: boolean;
    onClose: () => void;
    categories?: any[];
}

export default function MenuCategoryModal({
    open,
    onClose,
    categories = [],
}: MenuCategoryModalProps) {
    const [editingCategory, setEditingCategory] = useState<any | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: "",
    });

    useEffect(() => {
        if (!open) return;
        setEditingCategory(null);
        reset();
    }, [open]);

    if (!open) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        try {
            if (editingCategory) {
                put(
                    route(
                        "admin.menu-categories.update" as any,
                        editingCategory.id,
                    ),
                    {
                        onSuccess: () => {
                            reset();
                            setEditingCategory(null);
                        },
                    },
                );
            } else {
                post(route("admin.menu-categories.store" as any), {
                    onSuccess: () => reset(),
                });
            }
        } catch {
            reset();
            setEditingCategory(null);
        }
    };

    const handleEdit = (category: any) => {
        setEditingCategory(category);
        setData("name", category.name || "");
    };

    const handleDelete = (category: any) => {
        setCategoryToDelete(category);
    };

    const handleCloseDeleteModal = () => {
        if (isDeleting) return;

        setCategoryToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (!categoryToDelete) return;

        setIsDeleting(true);

        try {
            router.delete(
                route(
                    "admin.menu-categories.destroy" as any,
                    categoryToDelete.id,
                ),
                {
                    onSuccess: () => {
                        setCategoryToDelete(null);
                    },
                    onError: (errors) => {
                        const message =
                            errors.category ||
                            "Kategori gagal dihapus karena masih dipakai.";

                        window.alert(message);
                    },
                    onFinish: () => {
                        setIsDeleting(false);
                    },
                },
            );
        } catch {
            console.warn("Route kategori belum tersedia.");
            setIsDeleting(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
        reset();
    };

    return (
        <>
            <DeleteConfirmModal
                isOpen={Boolean(categoryToDelete)}
                title="Delete Confirmation"
                message={`Are you sure you want to delete "${categoryToDelete?.name ?? "this category"}"? This action cannot be undone.`}
                isDeleting={isDeleting}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
            />
            <div className="fixed inset-0 z-[999] overflow-y-auto bg-black/20 backdrop-blur-[10px]">
                <div className="flex min-h-full items-center justify-center p-4 md:p-8">
                    <div className="relative max-h-[calc(100vh-32px)] w-full max-w-[540px] overflow-y-auto rounded-[28px] bg-[#F6F5F3] px-5 py-6 shadow-[0_30px_90px_rgba(39,19,16,0.22)] md:max-h-[calc(100vh-64px)] md:rounded-[32px] md:px-8 md:py-8">
                    <button
                        onClick={onClose}
                        className="absolute right-5 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#271310] md:right-8 md:top-8"
                    >
                        <X size={21} />
                    </button>

                    <div className="mb-7 pr-10">
                        <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#8C651C]">
                            Menu Collection
                        </p>
                        <h2 className="text-[25px] font-extrabold tracking-[-0.8px] text-[#271310] md:text-[29px]">
                            Manage Categories
                        </h2>
                        <p className="mt-2 text-[13px] font-medium text-[#5A4A47] md:text-[15px]">
                            Tambahkan, ubah, atau hapus kategori makanan dan
                            minuman.
                        </p>
                    </div>

                    <div className="mb-5 max-h-[320px] space-y-3 overflow-y-auto pr-1 md:max-h-[360px]">
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="flex items-center justify-between gap-3 rounded-[16px] bg-white p-4"
                                >
                                    <div>
                                        <p className="text-[15px] font-extrabold text-[#271310]">
                                            {category.name}
                                        </p>
                                        <p className="text-[11px] font-semibold text-[#8B807D]">
                                            Category ID: {category.id}
                                            {typeof category.menus_count ===
                                            "number"
                                                ? ` • ${category.menus_count} menu`
                                                : ""}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#ECE8E6] bg-[#FAFAF9] text-[#5A4A47]"
                                        >
                                            <Pencil size={15} />
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(category)
                                            }
                                            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#F3DEDE] bg-[#FFF8F8] text-[#B42318]"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-[18px] border border-dashed border-[#D8D1CE] bg-white/60 p-6 text-center">
                                <p className="text-[13px] font-bold text-[#5A4A47]">
                                    Belum ada kategori.
                                </p>
                            </div>
                        )}
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="sticky bottom-0 rounded-[20px] border border-[#ECE8E6] bg-white p-4 shadow-[0_-10px_30px_rgba(39,19,16,0.06)]"
                    >
                        <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#6F625F]">
                            {editingCategory
                                ? "Edit Category"
                                : "Add New Category"}
                        </label>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
                            <input
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="e.g. Coffee, Snack, Main Course"
                                className="h-12 rounded-[14px] border border-[#ECE8E6] bg-[#FAFAF9] px-4 text-[14px] font-medium outline-none focus:ring-2 focus:ring-[#301713]/10"
                                required
                            />

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#301713] px-6 text-[13px] font-extrabold text-white disabled:opacity-50"
                            >
                                <Plus size={16} />
                                {processing
                                    ? "Saving..."
                                    : editingCategory
                                      ? "Update"
                                      : "Add"}
                            </button>
                        </div>

                        {errors.name && (
                            <p className="mt-2 text-[11px] font-medium text-red-500">
                                {errors.name}
                            </p>
                        )}

                        {editingCategory && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="mt-3 text-[12px] font-bold text-[#5A4A47] underline"
                            >
                                Cancel edit
                            </button>
                        )}
                    </form>
                </div>
            </div>
            </div>
        </>
    );
}
