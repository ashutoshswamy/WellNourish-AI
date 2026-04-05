"use client";

import Link from "next/link";
import { Logo } from "@/components/global/Logo";
import { UserButton, useUser } from "@clerk/nextjs";

export function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="w-full relative z-20 flex justify-between items-center px-6 md:px-10 py-6 max-w-7xl mx-auto">
      <Logo />

      <div>
        {isSignedIn ? (
          <div className="flex items-center gap-5">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-[#8a9a8a] border border-transparent hover:text-lime-400 hover:border-lime-500/30 px-3 py-1.5 rounded-lg transition-all"
            >
              Dashboard
            </Link>
            <Link
              href="/history"
              className="text-sm font-medium text-[#8a9a8a] border border-transparent hover:text-lime-400 hover:border-lime-500/30 px-3 py-1.5 rounded-lg transition-all"
            >
              History
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium text-[#8a9a8a] border border-transparent hover:text-lime-400 hover:border-lime-500/30 px-3 py-1.5 rounded-lg transition-all"
            >
              Profile
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "w-9 h-9 ring-2 ring-lime-500/30 hover:ring-lime-500/50 transition-all",
                },
              }}
            />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-[#8a9a8a] hover:text-white transition-colors px-4 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-semibold text-[#060b06] bg-lime-400 rounded-full px-5 py-2.5 hover:bg-lime-300 transition-all hover:shadow-[0_0_24px_rgba(163,230,53,0.3)] active:scale-[0.97]"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
