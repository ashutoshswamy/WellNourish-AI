"use client";

import { motion } from "framer-motion";
import { LucideIcon, Check } from "lucide-react";

interface SelectionCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  compact?: boolean;
}

export function SelectionCard({
  icon: Icon,
  title,
  description,
  selected,
  onClick,
  compact = false,
}: SelectionCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`relative flex ${compact ? "flex-row items-center gap-3 p-4" : "flex-col items-center justify-center p-6"} rounded-2xl border transition-all duration-400 text-center w-full group overflow-hidden cursor-pointer ${
        selected
          ? "bg-lime-400/[0.07] border-lime-400/40 shadow-[0_4px_24px_rgba(163,230,53,0.08)]"
          : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04]"
      }`}
    >
      {/* Subtle top-edge highlight when selected */}
      {selected && (
        <motion.div
          className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-lime-400/60 to-transparent"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* Icon */}
      <div
        className={`${compact ? "" : "mb-3"} ${compact ? "p-2.5" : "p-3.5"} rounded-xl transition-all duration-400 ${
          selected
            ? "bg-lime-400 text-black shadow-[0_0_16px_rgba(163,230,53,0.25)]"
            : "bg-white/[0.04] text-white/40 group-hover:text-white/60 group-hover:bg-white/[0.06]"
        }`}
      >
        <Icon className={`${compact ? "w-4 h-4" : "w-5 h-5"} flex-shrink-0`} strokeWidth={1.8} />
      </div>

      {/* Text */}
      <div className={`${compact ? "text-left" : ""} transition-all duration-400`}>
        <h3
          className={`${compact ? "text-sm" : "text-[0.9rem]"} font-semibold tracking-tight ${
            selected ? "text-white" : "text-white/50 group-hover:text-white/70"
          }`}
        >
          {title}
        </h3>
        {description && (
          <p className={`text-[0.7rem] leading-relaxed mt-0.5 ${
            selected ? "text-lime-300/40" : "text-white/20 group-hover:text-white/30"
          }`}>
            {description}
          </p>
        )}
      </div>

      {/* Check indicator */}
      {selected && (
        <motion.div
          className={`absolute ${compact ? "right-3" : "top-2.5 right-2.5"} w-5 h-5 bg-lime-400 rounded-full flex items-center justify-center`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 300 }}
        >
          <Check className="w-3 h-3 text-black" strokeWidth={3} />
        </motion.div>
      )}
    </motion.button>
  );
}
