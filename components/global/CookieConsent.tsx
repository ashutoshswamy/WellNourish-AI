"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import Link from "next/link";

const CONSENT_KEY = "wellnourish-cookie-consent";

export function CookieConsent() {
  const [consent, setConsent] = useState<"accepted" | "declined" | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(CONSENT_KEY);
    if (saved === "accepted" || saved === "declined") {
      const timer = window.setTimeout(() => setConsent(saved), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const choose = (value: "accepted" | "declined") => {
    if (value === "declined") {
      document.cookie
        .split(";")
        .map((cookie) => cookie.trim().split("=")[0])
        .filter((name) => name.startsWith("_ga"))
        .forEach((name) => {
          document.cookie = `${name}=; Max-Age=0; path=/`;
        });
    }
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  };

  return (
    <>
      {consent === "accepted" && (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-1JP8VR2FSG"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-1JP8VR2FSG');
            `}
          </Script>
        </>
      )}
      {consent === null && (
        <aside
          role="dialog"
          aria-label="Cookie consent"
          className="fixed inset-x-4 bottom-4 z-50 rounded-2xl border border-line bg-surface p-5 shadow-lg sm:inset-x-auto sm:right-6 sm:max-w-md"
        >
          <h2 className="font-semibold">Cookies, your way</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">
            We use essential cookies to keep you signed in. Optional Google Analytics cookies help us understand site usage. Read our <Link href="/cookies" className="link">Cookie Policy</Link>.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => choose("declined")} className="btn btn-secondary">
              Decline analytics
            </button>
            <button type="button" onClick={() => choose("accepted")} className="btn btn-primary">
              Accept analytics
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
