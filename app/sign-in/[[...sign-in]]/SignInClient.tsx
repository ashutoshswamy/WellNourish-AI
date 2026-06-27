"use client";

import { SignIn } from "@clerk/nextjs";
import { Logo } from "@/components/global/Logo";

export function SignInClient() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div
        className="w-full max-w-5xl overflow-hidden rounded-3xl flex flex-col md:flex-row"
        style={{
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 0 100px rgba(180,245,90,0.04)",
        }}
      >
        {/* Left panel — branding */}
        <div
          className="relative md:w-1/2 p-10 md:p-14 flex flex-col justify-between overflow-hidden"
          style={{
            background: "#080e08",
            borderRight: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          {/* Decorative orbs */}
          <div
            className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(180,245,90,0.12) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute top-8 right-8 w-40 h-40 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)",
              filter: "blur(30px)",
            }}
          />

          {/* Subtle grid lines */}
          <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.025 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-r"
                style={{
                  left: `${(i + 1) * 12.5}%`,
                  borderColor: "rgba(180,245,90,0.5)",
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10">
            <Logo className="mb-12" textSize="text-lg" />
            <p
              className="text-xs font-semibold uppercase tracking-[0.25em] mb-4"
              style={{ color: "rgba(180,245,90,0.6)" }}
            >
              Welcome back
            </p>
            <h1
              className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight"
            >
              Back to{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, #b4f55a, #34d399)",
                }}
              >
                smarter
              </span>
              <br />
              nutrition.
            </h1>
          </div>

          <p className="relative z-10 text-sm mt-8" style={{ color: "#3a4a3a" }}>
            Pick up right where you left off.
          </p>
        </div>

        {/* Right panel — Clerk form */}
        <div
          className="md:w-1/2 flex flex-col items-center justify-center p-10 md:p-14"
          style={{ background: "#080e08" }}
        >
          <SignIn />
        </div>
      </div>
    </div>
  );
}
