import { useEffect, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import CustomerLayout from "@/Components/Layout/CustomerLayout";
import CustomerBrand from "@/Components/customer/common/CustomerBrand";
import CustomerShell from "@/Components/customer/common/CustomerShell";
import LandingContentCard from "@/Components/customer/landing/LandingContentCard";

interface Props {
    tableId: string;
    tableNumber?: string;
    isOpen?: boolean;
}

export default function Landing({
    tableId,
    tableNumber,
    isOpen = true,
}: Props) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
            <Head title="Welcome — UCW" />
            <CustomerLayout hideTopBar>
                <CustomerShell>
                    {/* ─── Mobile layout: full-screen bg + bottom card ─── */}
                    <div className="md:hidden relative flex flex-col h-svh max-h-svh overflow-hidden">
                        {/* Background */}
                        <div className="absolute inset-0">
                            <img
                                src="/images/Unand_Co-Workspace_Interior.png"
                                alt="Unand Co-Workspace Interior"
                                className="w-full h-full object-cover object-center"
                                draggable={false}
                            />
                            <div
                                className="absolute inset-0"
                                style={{
                                    background:
                                        "linear-gradient(to bottom, rgba(20,12,6,0.22) 0%, rgba(20,12,6,0.12) 25%, rgba(20,12,6,0.45) 55%, rgba(20,12,6,0.90) 75%, rgba(20,12,6,0.97) 100%)",
                                }}
                            />
                            <div
                                className="absolute inset-0"
                                style={{
                                    background:
                                        "radial-gradient(ellipse at center, transparent 35%, rgba(20,12,6,0.38) 100%)",
                                }}
                            />
                        </div>

                        {/* Foreground */}
                        <div className="relative z-10 flex flex-col h-full px-5 select-none">
                            {/* Brand — top */}
                            <div
                                className="pt-[clamp(24px,7vh,52px)] flex flex-col items-center"
                                style={{
                                    opacity: visible ? 1 : 0,
                                    transform: visible
                                        ? "translateY(0)"
                                        : "translateY(-14px)",
                                    transition:
                                        "opacity 0.6s ease-out, transform 0.6s ease-out",
                                }}
                            >
                                <CustomerBrand
                                    dark={false}
                                    logoSize={62}
                                    iconSize={28}
                                    align="center"
                                />
                            </div>

                            <div className="flex-1" />

                            {/* Bottom card */}
                            <div
                                style={{
                                    opacity: visible ? 1 : 0,
                                    transform: visible
                                        ? "translateY(0)"
                                        : "translateY(28px)",
                                    transition:
                                        "opacity 0.65s ease-out 0.1s, transform 0.65s ease-out 0.1s",
                                }}
                            >
                                <div
                                    className="rounded-t-[26px] px-5 pt-5 pb-8 max-h-[58svh] overflow-hidden"
                                    style={{
                                        background: "rgba(250,247,242,0.97)",
                                        backdropFilter: "blur(24px)",
                                        WebkitBackdropFilter: "blur(24px)",
                                        boxShadow:
                                            "0 -12px 48px rgba(0,0,0,0.28)",
                                    }}
                                >
                                    <LandingContentCard
                                        tableId={tableId}
                                        isOpen={isOpen}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer tagline */}
                        <div
                            className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none z-20"
                            style={{
                                opacity: visible ? 0.28 : 0,
                                transition: "opacity 0.8s ease-out 0.35s",
                            }}
                        >
                            <p
                                className="text-white tracking-[0.24em] uppercase"
                                style={{ fontSize: "8.5px" }}
                            >
                                SCAN • ORDER • FOCUS • CREATE
                            </p>
                        </div>
                    </div>

                    {/* ─── Desktop layout: two columns ─── */}
                    <div className="hidden md:flex h-svh max-h-svh overflow-hidden">
                        {/* Left — background image + brand */}
                        <div className="relative flex-1 flex flex-col overflow-hidden">
                            <img
                                src="/images/Unand_Co-Workspace_Interior_Landscape.png"
                                alt="Unand Co-Workspace Interior"
                                className="absolute inset-0 w-full h-full object-cover object-center"
                                draggable={false}
                            />
                            <div
                                className="absolute inset-0"
                                style={{
                                    background:
                                        "linear-gradient(to bottom, rgba(20,12,6,0.28) 0%, rgba(20,12,6,0.10) 30%, rgba(20,12,6,0.55) 70%, rgba(20,12,6,0.88) 100%)",
                                }}
                            />
                            <div
                                className="absolute inset-0"
                                style={{
                                    background:
                                        "radial-gradient(ellipse at center, transparent 30%, rgba(20,12,6,0.40) 100%)",
                                }}
                            />

                            {/* Brand top-left */}
                            <div
                                className="relative z-10 pt-10 pl-12 flex flex-col items-start"
                                style={{
                                    opacity: visible ? 1 : 0,
                                    transform: visible
                                        ? "translateY(0)"
                                        : "translateY(-14px)",
                                    transition:
                                        "opacity 0.6s ease-out, transform 0.6s ease-out",
                                }}
                            >
                                <CustomerBrand
                                    dark={false}
                                    logoSize={56}
                                    iconSize={24}
                                    align="left"
                                />
                            </div>

                            {/* Bottom-left ambient */}
                            <div
                                className="absolute bottom-10 left-12 z-10"
                                style={{
                                    opacity: visible ? 0.32 : 0,
                                    transition: "opacity 0.8s ease-out 0.4s",
                                }}
                            >
                                <p
                                    className="text-white tracking-[0.22em] uppercase"
                                    style={{
                                        fontFamily: "monospace",
                                        fontSize: "8.5px",
                                    }}
                                >
                                    SCAN · ORDER · FOCUS · CREATE
                                </p>
                            </div>
                        </div>

                        {/* Right — glass panel */}
                        <div
                            className="w-[420px] lg:w-[440px] shrink-0 flex flex-col justify-center px-8 lg:px-10 py-6 overflow-hidden"
                            style={{
                                background: "rgba(250,247,242,0.97)",
                                backdropFilter: "blur(32px)",
                                WebkitBackdropFilter: "blur(32px)",
                                borderLeft: "1px solid rgba(255,255,255,0.25)",
                                boxShadow: "-24px 0 64px rgba(0,0,0,0.22)",
                            }}
                        >
                            {/* Table chip */}
                            {tableNumber && (
                                <div
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 self-start"
                                    style={{
                                        background: "rgba(20,16,10,0.06)",
                                        border: "1px solid rgba(20,16,10,0.10)",
                                        fontSize: "11px",
                                        color: "var(--color-ucw-text-muted)",
                                    }}
                                >
                                    <svg
                                        width="11"
                                        height="11"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    >
                                        <rect
                                            x="3"
                                            y="3"
                                            width="18"
                                            height="18"
                                            rx="2"
                                        />
                                        <path d="M3 9h18M9 21V9" />
                                    </svg>
                                    Table{" "}
                                    <span
                                        className="font-bold ml-1"
                                        style={{
                                            color: "var(--color-ucw-dark)",
                                        }}
                                    >
                                        {tableNumber}
                                    </span>
                                </div>
                            )}

                            <LandingContentCard
                                tableId={tableId}
                                isOpen={isOpen}
                                desktop
                            />

                            {/* Feature list */}
                            <div
                                className="mt-6 pt-6 flex flex-col gap-2.5"
                                style={{
                                    borderTop:
                                        "1px solid var(--color-ucw-border)",
                                }}
                            >
                                {[
                                    {
                                        icon: "☕",
                                        text: "Specialty coffee sourced from local highlands",
                                    },
                                    {
                                        icon: "⚡",
                                        text: "High-speed Wi-Fi & dedicated workspaces",
                                    },
                                    {
                                        icon: "👥",
                                        text: "Private meeting rooms available",
                                    },
                                ].map((f) => (
                                    <div
                                        key={f.text}
                                        className="flex items-center gap-3"
                                    >
                                        <div
                                            className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 text-sm"
                                            style={{
                                                background:
                                                    "rgba(20,16,10,0.05)",
                                                border: "1px solid rgba(20,16,10,0.09)",
                                            }}
                                        >
                                            {f.icon}
                                        </div>
                                        <span
                                            style={{
                                                fontSize: "13px",
                                                color: "var(--color-ucw-text-muted)",
                                            }}
                                        >
                                            {f.text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <p
                                className="mt-8 tracking-[0.2em] uppercase"
                                style={{
                                    fontFamily: "monospace",
                                    fontSize: "8.5px",
                                    color: "var(--color-ucw-text-muted)",
                                }}
                            >
                                SCAN · ORDER · FOCUS · CREATE
                            </p>
                        </div>
                    </div>
                </CustomerShell>
            </CustomerLayout>
        </>
    );
}
