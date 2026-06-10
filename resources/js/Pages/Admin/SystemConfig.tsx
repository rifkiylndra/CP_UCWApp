import AdminLayout from "@/Components/Layout/AdminLayout";
import type { AdminUser } from "@/types/admin";

interface Props {
    auth: { user: AdminUser };
    configs: Record<string, string>;
}

export default function SystemConfig({ auth, configs }: Props) {
    const entries = Object.entries(configs || {});

    return (
        <AdminLayout auth={auth} title="System Settings" currentRoute="admin.settings.index">
            <section className="font-['Manrope'] text-[#271310]">
                <div className="mb-6">
                    <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#5E735B]">
                        Configuration
                    </p>
                    <h1 className="text-[30px] font-extrabold">System Settings</h1>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#ECE8E4] bg-white">
                    {entries.length === 0 ? (
                        <p className="px-5 py-6 text-sm font-semibold text-[#8B7B6B]">
                            No system configuration found.
                        </p>
                    ) : (
                        entries.map(([key, value]) => (
                            <div
                                key={key}
                                className="grid gap-2 border-b border-[#ECE8E4] px-5 py-4 last:border-b-0 md:grid-cols-[240px_1fr]"
                            >
                                <span className="text-sm font-bold">{key}</span>
                                <span className="break-words text-sm text-[#5A4A47]">{value}</span>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </AdminLayout>
    );
}
