"use client";

import { SignIn } from "@clerk/nextjs";
import { Logo } from "@/components/global/Logo";

export default function SignInPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl flex flex-col md:flex-row border border-white/[0.06] shadow-[0_0_80px_rgba(163,230,53,0.04)]">
        {/* Left panel — branding */}
        <div className="relative md:w-1/2 p-10 md:p-14 flex flex-col justify-between overflow-hidden bg-[#0a0f0a] border-r border-white/[0.04]">
          {/* Decorative elements */}
          <div className="absolute -bottom-20 -left-20 w-[20rem] h-[20rem] bg-lime-500/[0.08] rounded-full blur-[100px]" />
          <div className="absolute top-10 right-10 w-[8rem] h-[8rem] bg-emerald-500/[0.06] rounded-full blur-[60px]" />

          {/* Vertical stripe accents */}
          <div className="absolute inset-0 flex pointer-events-none opacity-[0.04]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-full w-16 border-r border-lime-400/30"
              />
            ))}
          </div>

          <div className="relative z-10">
            <Logo className="mb-12" textSize="text-lg" />
            <h1 className="text-2xl md:text-3xl font-semibold text-white leading-tight tracking-tight">
              Welcome back to
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-400">
                smarter nutrition.
              </span>
            </h1>
          </div>

          <p className="relative z-10 text-sm text-[#4a5a4a] mt-8">
            Pick up right where you left off.
          </p>
        </div>

        {/* Right panel — Clerk sign-in form */}
        <div className="md:w-1/2 flex flex-col items-center justify-center p-10 md:p-14 bg-[#0a0f0a]">
          <SignIn />
        </div>
      </div>
    </div>
  );
}
