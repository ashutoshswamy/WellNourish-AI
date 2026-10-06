"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { useUser } from "@/components/providers/AuthProvider";

const copy = {
  "sign-in": {
    heading: "Welcome back.",
    sub: "Your plan, recipes and grocery list are right where you left them.",
    submit: "Sign in",
    pending: "Signing in…",
    error: "Email or password is incorrect.",
    googleError: "Google sign-in didn't complete. Try again.",
    switchText: "New here?",
    switchLink: { href: "/sign-up", label: "Create an account" },
  },
  "sign-up": {
    heading: "Your week of meals starts here.",
    sub: "Free to start. No credit card.",
    submit: "Create account",
    pending: "Creating account…",
    error: "Couldn't create the account. That email may already be registered.",
    googleError: "Google sign-up didn't complete. Try again.",
    switchText: "Already have an account?",
    switchLink: { href: "/sign-in", label: "Sign in" },
  },
};

const perks = ["A 7-day plan sized to your body", "Recipes that skip your allergens", "One grocery list for the whole week"];

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const t = copy[mode];
  const { isSignedIn, isLoaded, signIn, signUp, signInWithGoogle } = useUser();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) router.replace("/dashboard");
  }, [isLoaded, isSignedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "sign-up") await signUp(email, password, fullName);
      else await signIn(email, password);
    } catch {
      setError(t.error);
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      setError(t.googleError);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="grid flex-1 items-stretch gap-6 py-10 md:py-14 lg:grid-cols-2">
      <section className="flex flex-col justify-between gap-10 rounded-2xl bg-kale p-8 text-on-kale md:p-12">
        <div>
          <h1 className="display max-w-md text-[clamp(2.2rem,4vw,3.4rem)]">{t.heading}</h1>
          <p className="mt-4 max-w-sm text-on-kale/80">{t.sub}</p>
        </div>
        <ul className="hidden space-y-3 sm:block">
          {perks.map((p) => (
            <li key={p} className="flex items-center gap-3">
              <span className="grid size-6 place-items-center rounded-full bg-accent text-on-accent">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex items-center justify-center">
        <div className="w-full max-w-sm">
          <button type="button" onClick={handleGoogle} disabled={googleLoading} className="btn btn-secondary h-12 w-full bg-surface">
            {googleLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.3-.1-2.7-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3c-7.7 0-14.4 4.4-17.7 10.7z" />
                <path fill="#4CAF50" d="M24 45c5.4 0 10.3-1.8 14-4.9l-6.5-5.5C29.4 36.4 26.9 37 24 37c-5.3 0-9.7-3.1-11.3-8l-6.6 5.1C9.5 40.5 16.2 45 24 45z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.4-2.3 4.5-4.2 5.9l6.5 5.5C39.6 37.4 44 31.2 44 24c0-1.3-.1-2.7-.4-3.5z" />
              </svg>
            )}
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-sm text-ink-3">
            <span className="h-px flex-1 bg-line" />
            or with email
            <span className="h-px flex-1 bg-line" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {mode === "sign-up" && (
              <div>
                <label htmlFor="name" className="field-label">Full name</label>
                <input id="name" type="text" autoComplete="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="field" />
              </div>
            )}
            <div>
              <label htmlFor="email" className="field-label">Email</label>
              <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
            </div>
            <div>
              <label htmlFor="password" className="field-label">Password</label>
              <input
                id="password"
                type="password"
                autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                required
                minLength={mode === "sign-up" ? 6 : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby={mode === "sign-up" ? "pw-hint" : undefined}
                className="field"
              />
              {mode === "sign-up" && <p id="pw-hint" className="mt-1.5 text-sm text-ink-3">At least 6 characters.</p>}
            </div>
            {error && (
              <p role="alert" className="rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
                {error}
              </p>
            )}
            <button type="submit" disabled={loading} className="btn btn-primary h-12 w-full">
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? t.pending : t.submit}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-2">
            {t.switchText}{" "}
            <Link href={t.switchLink.href} className="link font-semibold">
              {t.switchLink.label}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
