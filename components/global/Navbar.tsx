"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/global/Logo";
import { UserButton, useUser } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { isSignedIn } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <nav className="w-full relative z-50 flex justify-between items-center px-6 md:px-10 py-6 max-w-7xl mx-auto">
      <Logo />

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-5">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              link.isPrimary 
                ? "text-sm font-semibold text-[#060b06] bg-lime-400 rounded-full px-5 py-2.5 hover:bg-lime-300 transition-all hover:shadow-[0_0_24px_rgba(163,230,53,0.3)] active:scale-[0.97]"
                : link.isSecondary 
                  ? "text-sm font-medium text-[#8a9a8a] hover:text-white transition-colors px-4 py-2"
                  : "text-sm font-medium text-[#8a9a8a] border border-transparent hover:text-lime-400 hover:border-lime-500/30 px-3 py-1.5 rounded-lg transition-all"
            }
          >
            {link.label}
          </Link>
        ))}
        {isSignedIn && (
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 ring-2 ring-lime-500/30 hover:ring-lime-500/50 transition-all",
              },
            }}
          />
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex md:hidden items-center gap-4">
        {isSignedIn && (
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 ring-2 ring-lime-500/30",
              },
            }}
          />
        )}
        <button
          onClick={toggleMenu}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-lime-400 hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Interface - Dropdown Style */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 p-6 md:hidden z-50 pointer-events-none"
          >
            <div className="w-full bg-[#0a110a]/95 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 shadow-2xl flex flex-col gap-4 pointer-events-auto overflow-hidden relative">
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/[0.05] blur-3xl rounded-full" />
              
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={
                      link.isPrimary 
                        ? "flex items-center justify-center w-full text-base font-bold text-[#060b06] bg-lime-400 rounded-2xl py-4 hover:bg-lime-300 transition-all active:scale-[0.98]"
                        : "flex items-center w-full text-base font-medium text-[#8a9a8a] py-3 px-4 hover:text-white transition-colors border-b border-white/[0.04] last:border-0"
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
