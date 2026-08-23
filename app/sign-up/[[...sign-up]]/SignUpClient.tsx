"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/global/Logo";
import { useUser } from "@/components/providers/AuthProvider";

export function SignUpClient() {
  const { isSignedIn, isLoaded, signUp, signInWithGoogle } = useUser();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) router.replace("/dashboard");
  }, [isLoaded, isSignedIn, router]);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signUp(email, password, fullName);
    } catch {
      setError("Could not create your account. The email may already be in use.");
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      setError("Could not sign up with Google.");
      setGoogleLoading(false);
    }
  };

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
                style={{ backgroundImage: "linear-gradient(135deg, #b4f55a, #34d399)" }}
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
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#b4f55a" }} />
                </div>
                <span className="text-sm" style={{ color: "#4a5a4a" }}>
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — sign-up form */}
        <div
          className="md:w-1/2 flex flex-col items-center justify-center p-10 md:p-14"
          style={{ background: "#080e08" }}
        >
          <div className="w-full max-w-sm flex flex-col gap-4">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-medium text-sm text-white transition-all disabled:opacity-60"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <svg width="16" height="16" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.3-.1-2.7-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3c-7.7 0-14.4 4.4-17.7 10.7z" />
                <path fill="#4CAF50" d="M24 45c5.4 0 10.3-1.8 14-4.9l-6.5-5.5C29.4 36.4 26.9 37 24 37c-5.3 0-9.7-3.1-11.3-8l-6.6 5.1C9.5 40.5 16.2 45 24 45z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.4-2.3 4.5-4.2 5.9l6.5 5.5C39.6 37.4 44 31.2 44 24c0-1.3-.1-2.7-.4-3.5z" />
              </svg>
              {googleLoading ? "Signing up…" : "Continue with Google"}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              <span className="text-[10px] uppercase tracking-wider" style={{ color: "#3a4a3a" }}>
                or
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "#6a7a6a" }}>
                Full name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm outline-none focus:border-[rgba(180,245,90,0.4)] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "#6a7a6a" }}>
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm outline-none focus:border-[rgba(180,245,90,0.4)] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "#6a7a6a" }}>
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm outline-none focus:border-[rgba(180,245,90,0.4)] transition-colors"
              />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-60"
              style={{ background: "#b4f55a", color: "#050a05" }}
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
            <p className="text-xs text-center mt-2" style={{ color: "#3a4a3a" }}>
              Already have an account?{" "}
              <Link href="/sign-in" className="font-medium" style={{ color: "#b4f55a" }}>
                Sign in
              </Link>
            </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
