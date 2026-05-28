import { useEffect, useState } from "react";
import type { KanbanOrder } from "@/types/staff";

interface Props {
    order: KanbanOrder | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirmPayment: (orderId: string) => void;
}

export default function CashPaymentModal({
    order,
    isOpen,
    onClose,
    onConfirmPayment,
}: Props) {
    const [amountReceived, setAmountReceived] = useState("");

    useEffect(() => {
        if (isOpen) setAmountReceived("");
    }, [isOpen]);

    if (!isOpen || !order) return null;

    const totalAmount = order.totalAmount;
    const received = Number(amountReceived || 0);
    const change = received >= totalAmount ? received - totalAmount : 0;
    const isEnough = received >= totalAmount;

    const formatRupiah = (value: number) =>
        new Intl.NumberFormat("id-ID").format(value);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 font-['Manrope']">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-[430px] rounded-[28px] bg-white p-8 shadow-2xl">
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#5A4A47]">
                            Cash Verification
                        </p>
                        <h2 className="mt-2 text-[28px] font-extrabold text-[#271310]">
                            Payment
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F4F3] text-[#271310]"
                    >
                        ✕
                    </button>
                </div>

                <div className="mb-6 rounded-[20px] bg-[#271310] p-6 text-center text-white">
                    <p className="mb-2 text-[12px] font-medium text-white/60">
                        Total Pembayaran
                    </p>
                    <h3 className="text-[38px] font-extrabold">
                        Rp {formatRupiah(totalAmount)}
                    </h3>
                </div>

                <div className="mb-4">
                    <label className="mb-2 block text-[13px] font-bold text-[#271310]">
                        Uang diterima
                    </label>
                    <input
                        type="number"
                        value={amountReceived}
                        onChange={(e) => setAmountReceived(e.target.value)}
                        placeholder="Masukkan nominal uang customer"
                        className="h-12 w-full rounded-2xl border border-[#E7E1DC] bg-[#F9F9F8] px-4 text-[14px] font-semibold text-[#271310] outline-none focus:border-[#271310]"
                    />
                </div>

                <div className="mb-5 grid grid-cols-3 gap-3">
                    {[50000, 100000, totalAmount].map((value, index) => (
                        <button
                            key={index}
                            onClick={() => setAmountReceived(String(value))}
                            className="rounded-2xl bg-[#F4F4F3] px-3 py-3 text-center text-[13px] font-bold text-[#271310]"
                        >
                            {index === 2 ? "Exact" : `Rp ${formatRupiah(value)}`}
                        </button>
                    ))}
                </div>

                <div className="mb-6 rounded-2xl bg-[#F4F4F3] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#5A4A47]">
                        Kembalian
                    </p>
                    <p className="mt-1 text-[24px] font-extrabold text-[#271310]">
                        Rp {formatRupiah(change)}
                    </p>
                </div>

                <button
                    disabled={!isEnough}
                    onClick={() => {
                        onConfirmPayment(order.id);
                        onClose();
                    }}
                    className="h-13 w-full rounded-2xl bg-[#271310] py-4 text-[15px] font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Confirm Payment
                </button>
            </div>
        </div>
    );
}