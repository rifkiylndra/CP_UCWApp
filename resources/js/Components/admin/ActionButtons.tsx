import { Pencil, Trash2 } from "lucide-react";

interface ActionButtonsProps {
    onEdit: () => void;
    onDelete: () => void;
    editLabel?: string;
    deleteLabel?: string;
    variant?: "icon" | "labeled";
}

export default function ActionButtons({
    onEdit,
    onDelete,
    editLabel = "Edit",
    deleteLabel = "Delete",
    variant = "icon",
}: ActionButtonsProps) {
    if (variant === "labeled") {
        return (
            <div className="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={onEdit}
                    className="flex h-10 items-center justify-center gap-2 rounded-[12px] border border-[#ECE8E6] bg-[#FAFAF9] text-[12px] font-extrabold text-[#271310]"
                >
                    <Pencil size={14} />
                    {editLabel}
                </button>

                <button
                    type="button"
                    onClick={onDelete}
                    className="flex h-10 items-center justify-center gap-2 rounded-[12px] border border-[#F3DEDE] bg-[#FFF8F8] text-[12px] font-extrabold text-[#B42318]"
                >
                    <Trash2 size={14} />
                    {deleteLabel}
                </button>
            </div>
        );
    }

    return (
        <div className="flex justify-center gap-2">
            <button
                type="button"
                aria-label={editLabel}
                onClick={onEdit}
                className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#ECE8E6] bg-white text-[#5A4A47] transition hover:bg-[#F5F4F3] hover:text-[#271310]"
            >
                <Pencil size={15} strokeWidth={2.4} />
            </button>

            <button
                type="button"
                aria-label={deleteLabel}
                onClick={onDelete}
                className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#F3DEDE] bg-[#FFF8F8] text-[#B42318] transition hover:bg-[#FDECEC]"
            >
                <Trash2 size={15} strokeWidth={2.4} />
            </button>
        </div>
    );
}
