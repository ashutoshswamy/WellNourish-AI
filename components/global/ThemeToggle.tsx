"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, ChevronDown, Monitor, Moon, Sun } from "lucide-react";

type Choice = "light" | "dark" | "system";

const options: { value: Choice; label: string; hint: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", hint: "Bright and clear", Icon: Sun },
  { value: "dark", label: "Dark", hint: "Easy on the eyes", Icon: Moon },
  { value: "system", label: "System", hint: "Match your device", Icon: Monitor },
];

// The saved choice lives in localStorage; useSyncExternalStore reads it without a hydration mismatch.
const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  window.addEventListener("themechange", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("themechange", cb);
  };
};
const readChoice = (): Choice => {
  try {
    const saved = localStorage.getItem("theme");
    return saved === "light" || saved === "dark" ? saved : "system";
  } catch {
    return "system";
  }
};

// A pinned theme lives in localStorage and on <html data-theme>; "System" clears both so the
// site follows the OS again. The pre-paint script in app/layout.tsx re-applies a pinned value on load.
export function ThemeToggle({ className = "" }: { className?: string }) {
  const choice = useSyncExternalStore(subscribe, readChoice, (): Choice => "system");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on outside press
  useEffect(() => {
    if (!open) return;
    const onPress = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPress);
    return () => document.removeEventListener("pointerdown", onPress);
  }, [open]);

  // Move focus into the menu when it opens
  useEffect(() => {
    if (open) rootRef.current?.querySelector<HTMLElement>('[role="menuitemradio"][aria-checked="true"]')?.focus();
  }, [open]);

  function pick(next: Choice, origin: DOMRect) {
    const root = document.documentElement;
    const apply = () => {
      if (next === "system") root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", next);
      try {
        if (next === "system") localStorage.removeItem("theme");
        else localStorage.setItem("theme", next);
      } catch {}
      window.dispatchEvent(new Event("themechange"));
    };
    setOpen(false);
    triggerRef.current?.focus();

    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
      return;
    }
    root.style.setProperty("--tx", `${origin.left + origin.width / 2}px`);
    root.style.setProperty("--ty", `${origin.top + origin.height / 2}px`);
    document.startViewTransition(apply);
  }

  function onMenuKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    const step = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const items = [...e.currentTarget.querySelectorAll<HTMLElement>('[role="menuitemradio"]')];
    const at = items.indexOf(document.activeElement as HTMLElement);
    items[(at + step + items.length) % items.length]?.focus();
  }

  const current = options.find((o) => o.value === choice)!;
  const Current = current.Icon;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Theme: ${current.label}`}
        className="inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 text-sm font-bold text-ink transition-colors hover:bg-sunken aria-expanded:bg-sunken"
      >
        <Current className="size-[1.15rem]" />
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown className={`hidden size-4 text-ink-3 transition-transform duration-200 sm:block ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Theme"
          onKeyDown={onMenuKeyDown}
          className="menu-in absolute right-0 top-full z-50 mt-2 w-60 origin-top-right rounded-2xl border border-line bg-surface p-1.5 shadow-[0_24px_48px_-20px_rgb(23_19_31/0.4)]"
        >
          <p className="px-3 pb-1.5 pt-2 text-xs font-bold text-ink-3">Appearance</p>
          {options.map(({ value, label, hint, Icon }) => {
            const active = choice === value;
            return (
              <button
                key={value}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                tabIndex={active ? 0 : -1}
                onClick={(e) => pick(value, e.currentTarget.getBoundingClientRect())}
                className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-sunken focus-visible:bg-sunken focus-visible:outline-none"
              >
                <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${active ? "bg-ink text-paper" : "bg-sunken text-ink-2"}`}>
                  <Icon className="size-[1.1rem]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold leading-tight text-ink">{label}</span>
                  <span className="block text-xs leading-tight text-ink-3">{hint}</span>
                </span>
                {active && <Check className="size-4 shrink-0 text-accent" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
