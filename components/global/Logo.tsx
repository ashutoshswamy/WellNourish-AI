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
  showText = true 
}: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`}>
      <div className="relative">
        <div 
          className="rounded-xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center group-hover:bg-lime-400/15 transition-colors"
          style={{ width: iconSize * 1.8, height: iconSize * 1.8 }}
        >
          <Leaf 
            className="text-lime-400" 
            style={{ width: iconSize, height: iconSize }} 
          />
        </div>
        <div className="absolute -inset-1 rounded-xl bg-lime-400/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      {showText && (
        <span className={`font-semibold text-white tracking-tight ${textSize}`}>
          WellNourish AI
        </span>
      )}
    </Link>
  );
}
