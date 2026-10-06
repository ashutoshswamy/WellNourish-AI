"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { Logo } from "@/components/global/Logo";
import { ThemeToggle } from "@/components/global/ThemeToggle";
import { useUser } from "@/components/providers/AuthProvider";

const appLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/plan", label: "Plan" },
  { href: "/shopping-list", label: "Groceries" },
  { href: "/history", label: "History" },
  { href: "/profile", label: "Profile" },
];

export function Navbar() {
  const { isSignedIn, signOutUser } = useUser();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!open || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(menuRef.current, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.3 });
      gsap.fromTo("a, button", { autoAlpha: 0, y: -6 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.03, delay: 0.05 });
    },
    { dependencies: [open], scope: menuRef },
  );

  // Close the mobile menu on navigation
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const linkClass = (href: string) =>
    `rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
      pathname.startsWith(href) ? "bg-sunken text-ink" : "text-ink-2 hover:text-ink"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          <ThemeToggle className="mr-1 size-9" />
          {isSignedIn ? (
            <>
              {appLinks.map((l) => (
                <Link key={l.href} href={l.href} className={linkClass(l.href)} aria-current={pathname.startsWith(l.href) ? "page" : undefined}>
                  {l.label}
                </Link>
              ))}
              <button onClick={() => signOutUser()} className="btn btn-secondary ml-2 h-9 px-3.5" aria-label="Sign out">
                <LogOut className="size-4" />
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="px-3.5 py-2 text-sm font-medium text-ink-2 hover:text-ink">
                Sign in
              </Link>
              <Link href="/sign-up" className="btn btn-primary h-10">
                Build my plan
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="btn btn-secondary size-10 px-0"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div ref={menuRef} className="border-t border-line bg-paper px-4 pb-5 pt-3 lg:hidden">
          <div className="flex flex-col gap-1" onClick={() => setOpen(false)}>
            {isSignedIn ? (
              <>
                {appLinks.map((l) => (
                  <Link key={l.href} href={l.href} className={`${linkClass(l.href)} py-3`}>
                    {l.label}
                  </Link>
                ))}
                <button onClick={() => signOutUser()} className="btn btn-secondary mt-3 w-full">
                  <LogOut className="size-4" /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="btn btn-secondary w-full">Sign in</Link>
                <Link href="/sign-up" className="btn btn-primary mt-2 w-full">Build my plan</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
