import React, { FormEvent } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { Coffee, User, LockKeyhole, ArrowRight, Globe2, CircleHelp } from "lucide-react";

export default function AdminLogin() {
  const { data, setData, post, processing, errors } = useForm({
    username: "",
    password: "",
    remember: false as boolean,
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    let postRoute = "#";
    try { postRoute = route("admin.login.post" as any); } catch (err) {}
    post(postRoute);
  };

  return (
    <div className="h-screen w-full bg-[#F7F5F2] text-[#2A1712] overflow-hidden flex items-center justify-center px-5">
      <Head title="Admin Login — UCW" />

      {/* Soft background glow kanan */}
      <div className="pointer-events-none fixed right-0 top-0 hidden h-full w-[38%] bg-[radial-gradient(circle_at_center,#ffffff_0%,#f3eee8_45%,transparent_75%)] opacity-80 md:block" />

      <div className="relative z-10 flex w-full max-w-[460px] flex-col items-center rounded-[22px] bg-white px-8 py-9 shadow-[0_18px_60px_rgba(42,23,18,0.08)] sm:px-12 sm:py-10">
        {/* Logo */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-[#2A1712] bg-white shadow-sm">
          <img src="/assets/images/logo.png" alt="UCW Logo" className="h-full w-full object-cover" />
        </div>

        {/* Title */}
        <h1 className="mb-7 text-center text-[24px] font-extrabold tracking-[-1px] text-[#2A1712] sm:text-[26px]">
          UNAND Co-Workspace
        </h1>

        <form onSubmit={submit} className="w-full space-y-4">
          {/* Username */}
          <div>
            <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#4A403C]">
              Username
            </label>
            <div className="flex h-[48px] items-center gap-3 rounded-[10px] bg-[#E7E6E5] px-4 text-[#887B76]">
              <User size={17} strokeWidth={2} />
              <input
                type="text"
                name="username"
                value={data.username}
                onChange={(e) => setData("username", e.target.value)}
                placeholder="Enter administrative handle"
                className="h-full w-full border-0 bg-transparent text-[13.5px] font-medium text-[#2A1712] placeholder:text-[#AAA29F] focus:outline-none focus:ring-0"
                required
              />
            </div>
            {errors.username && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.username}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#4A403C]">
              Password
            </label>
            <div className="flex h-[48px] items-center gap-3 rounded-[10px] bg-[#E7E6E5] px-4 text-[#887B76]">
              <LockKeyhole size={17} strokeWidth={2} />
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                placeholder="••••••••"
                className="h-full w-full border-0 bg-transparent text-[13.5px] font-medium text-[#2A1712] placeholder:text-[#9D928E] focus:outline-none focus:ring-0"
                required
              />
            </div>
            {errors.password && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.password}</p>}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                name="remember"
                checked={data.remember}
                onChange={(e) => setData("remember", e.target.checked)}
                className="h-4 w-4 rounded-[4px] border-2 border-[#D8C7C0] bg-white text-[#2A1712] focus:ring-[#2A1712]"
              />
              <span className="text-[12.5px] font-medium text-[#4A403C]">Remember me</span>
            </label>
            <Link href="#" className="text-[12.5px] font-medium text-[#2A1712] transition hover:opacity-70">
              Forgot Access?
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={processing}
            className="mt-1 flex h-[54px] w-full items-center justify-center gap-7 rounded-[10px] bg-[#2A1712] text-[14px] font-extrabold text-white shadow-[0_14px_24px_rgba(42,23,18,0.22)] transition hover:bg-[#3A211B] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>Login</span>
            <ArrowRight size={18} strokeWidth={2.4} />
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-7 flex items-center justify-center gap-7 text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[#5D524E]">
          <Link href="#" className="flex items-center gap-1.5 hover:text-[#2A1712]">
            <Globe2 size={14} />
            English
          </Link>
          <Link href="#" className="flex items-center gap-1.5 hover:text-[#2A1712]">
            <CircleHelp size={14} />
            Support
          </Link>
        </div>

        <p className="mt-4 max-w-[240px] text-center text-[10px] font-medium uppercase leading-relaxed text-[#8B807B]">
          © 2026 UNAND CO-WORKSPACE. CRAFTED FOR THE ART OF COFFEE.
        </p>
      </div>
    </div>
  );
}