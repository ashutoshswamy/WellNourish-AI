"use client";

import { SignUp } from "@clerk/nextjs";
import { Logo } from "@/components/global/Logo";

export function SignUpClient() {
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
            className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(180,245,90,0.1) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />
          <div
            className="absolute top-12 left-8 w-32 h-32 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)",
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
              Get started free
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight">
              Your nutrition{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, #b4f55a, #34d399)",
                }}
              >
                journey
              </span>
              <br />
              starts here.
            </h1>
          </div>

          <div className="relative z-10 mt-8 space-y-3">
            {[
              "Personalized 7-day meal plans",
              "Macro-balanced recipes for your goals",
              "Auto-generated grocery shopping list",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2.5">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(180,245,90,0.12)", border: "1px solid rgba(180,245,90,0.2)" }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#b4f55a" }}
                  />
                </div>
                <span className="text-sm" style={{ color: "#4a5a4a" }}>
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — Clerk sign-up form */}
        <div
          className="md:w-1/2 flex flex-col items-center justify-center p-10 md:p-14"
          style={{ background: "#080e08" }}
        >
          <SignUp />
        </div>
      </div>
    </div>
  );
}
