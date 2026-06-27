"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/global/Logo";
import { UserButton, useUser } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { AnimatePresence, motion } from "framer-motion";

export function Navbar() {
  const { isSignedIn } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  interface NavLink {
    href: string;
    label: string;
    isPrimary?: boolean;
    isSecondary?: boolean;
  }

  const navLinks: NavLink[] = isSignedIn
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/history", label: "History" },
        { href: "/profile", label: "Profile" },
      ]
    : [
        { href: "/sign-in", label: "Sign in", isSecondary: true },
        { href: "/sign-up", label: "Get Started", isPrimary: true },
      ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP entrance for nav links
  useEffect(() => {
    if (!linksRef.current) return;
    const links = linksRef.current.querySelectorAll("a");
    gsap.fromTo(
      links,
      { opacity: 0, y: -8 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.3,
      }
    );
  }, [isSignedIn]);

  return (
    <nav
      ref={navRef}
      className={`w-full relative z-50 flex justify-between items-center px-6 md:px-10 py-5 max-w-7xl mx-auto transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl"
          : ""
      }`}
      style={
        scrolled
          ? {
              background: "rgba(5,10,5,0.75)",
              borderBottom: "1px solid rgba(180,245,90,0.06)",
            }
          : {}
      }
    >
      {/* Logo */}
      <Logo />

      {/* Desktop nav */}
      <div ref={linksRef} className="hidden md:flex items-center gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              link.isPrimary
                ? "relative text-sm font-semibold text-[#050a05] bg-[#b4f55a] rounded-full px-6 py-2.5 hover:bg-[#c9ff6f] transition-all hover:shadow-[0_0_28px_rgba(180,245,90,0.4)] active:scale-[0.97] overflow-hidden group"
                : link.isSecondary
                ? "text-sm font-medium text-[#6a7a6a] hover:text-white transition-colors px-4 py-2"
                : "text-sm font-medium text-[#7a8a7a] hover:text-[#b4f55a] px-3 py-1.5 rounded-lg transition-all hover:bg-white/[0.04]"
            }
          >
            {link.isPrimary && (
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
            )}
            {link.label}
          </Link>
        ))}
        {isSignedIn && (
          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "w-9 h-9 ring-2 ring-[#b4f55a]/30 hover:ring-[#b4f55a]/50 transition-all",
              },
            }}
          />
        )}
      </div>

      {/* Mobile toggle */}
      <div className="flex md:hidden items-center gap-4">
        {isSignedIn && (
          <UserButton
            appearance={{
              elements: { avatarBox: "w-8 h-8 ring-2 ring-[#b4f55a]/30" },
            }}
          />
        )}
        <button
          onClick={toggleMenu}
          className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#b4f55a] hover:bg-white/[0.08] transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute top-full left-4 right-4 md:hidden z-50 mt-2"
          >
            <div
              className="w-full backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-5 shadow-2xl flex flex-col gap-2 overflow-hidden relative"
              style={{ background: "rgba(5,10,5,0.92)" }}
            >
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl"
                style={{ background: "rgba(180,245,90,0.04)" }}
              />
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={
                      link.isPrimary
                        ? "flex items-center justify-center w-full text-sm font-bold text-[#050a05] bg-[#b4f55a] rounded-xl py-3.5 hover:bg-[#c9ff6f] transition-all"
                        : "flex items-center w-full text-sm font-medium text-[#8a9a8a] py-3 px-3 hover:text-white transition-colors border-b border-white/[0.04] last:border-0 rounded-lg hover:bg-white/[0.03]"
                    }
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
