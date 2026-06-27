"use client";

import Link from "next/link";
import { Leaf } from "lucide-react";

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  showText?: boolean;
}

export function Logo({
  className = "",
  iconSize = 20,
  textSize = "text-xl",
  showText = true,
}: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`}>
      <div className="relative">
        <div
          className="rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
          style={{
            width: iconSize * 1.8,
            height: iconSize * 1.8,
            background: "rgba(180,245,90,0.08)",
            border: "1px solid rgba(180,245,90,0.18)",
          }}
        >
          <Leaf
            style={{ width: iconSize, height: iconSize, color: "#b4f55a" }}
          />
        </div>
        {/* Glow */}
        <div
          className="absolute -inset-1 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "rgba(180,245,90,0.08)" }}
        />
      </div>
      {showText && (
        <span
          className={`font-semibold text-white tracking-tight ${textSize}`}
        >
          WellNourish{" "}
          <span style={{ color: "#b4f55a" }}>AI</span>
        </span>
      )}
    </Link>
  );
}
