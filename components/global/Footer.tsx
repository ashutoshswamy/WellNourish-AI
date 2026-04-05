"use client";

import Link from "next/link";
import { Logo } from "@/components/global/Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full py-12 border-t border-white/[0.04] bg-transparent mt-auto backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Logo iconSize={12} textSize="text-sm" />
          <p className="text-xs text-[#3a4a3a] font-medium">
             © {currentYear} All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-8">
          <Link
            href="/privacy"
            className="text-xs text-[#5a6a5a] hover:text-lime-400 transition-colors duration-200"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-xs text-[#5a6a5a] hover:text-lime-400 transition-colors duration-200"
          >
            Terms of Service
          </Link>
        </div>

        <div className="flex flex-col items-center md:items-end gap-1">
          <p className="text-xs text-[#3a4a3a] font-medium">
            Empowering healthy living with AI.
          </p>
        </div>
      </div>

      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-lime-400/10 to-transparent opacity-50" />
    </footer>
  );
}
