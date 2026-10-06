"use client";

import { Moon, Sun } from "lucide-react";

// Picking a theme pins it in localStorage; until then the site follows the system.
// The pre-paint script in app/layout.tsx re-applies the pinned value on load.
export function ThemeToggle({ className = "" }: { className?: string }) {
  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const root = document.documentElement;
    const isDark =
      root.dataset.theme === "dark" ||
      (root.dataset.theme !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
    const next = isDark ? "light" : "dark";
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {}
    };

    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    root.style.setProperty("--tx", `${r.left + r.width / 2}px`);
    root.style.setProperty("--ty", `${r.top + r.height / 2}px`);
    document.startViewTransition(apply);
  }

  return (
    <button onClick={toggle} className={`btn btn-secondary size-10 px-0 ${className}`} aria-label="Switch light or dark theme">
      <Moon className="size-4.5 dark:hidden" />
      <Sun className="hidden size-4.5 dark:block" />
    </button>
  );
}
