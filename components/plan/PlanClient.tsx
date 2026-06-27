"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sun,
  Coffee,
  Moon,
  Cookie,
  Flame,
  Droplets,
  Wheat,
  CircleDot,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle2,
} from "lucide-react";

interface Meal {
  id: string;
  meal_type: string;
  name: string;
  description: string;
  calories: number;
  protein?: string;
  carbs?: string;
  fat?: string;
  ingredients: string[];
  instructions: string;
}

interface PlanDay {
  id: string;
  day_number: number;
  total_calories: number;
  meals: Meal[];
}

interface Plan {
  id: string;
  created_at: string;
  plan_days: PlanDay[];
}

const mealMeta = [
  { type: "breakfast", label: "Breakfast", icon: Coffee, color: "#facc15", iconBg: "rgba(250,204,21,0.08)", iconBorder: "rgba(250,204,21,0.15)" },
  { type: "lunch",     label: "Lunch",     icon: Sun,    color: "#b4f55a", iconBg: "rgba(180,245,90,0.08)", iconBorder: "rgba(180,245,90,0.15)" },
  { type: "dinner",   label: "Dinner",   icon: Moon,   color: "#818cf8", iconBg: "rgba(129,140,248,0.08)", iconBorder: "rgba(129,140,248,0.15)" },
  { type: "snacks",   label: "Snacks",   icon: Cookie, color: "#fb923c", iconBg: "rgba(251,146,60,0.08)",  iconBorder: "rgba(251,146,60,0.15)"  },
];

const macroMeta = [
  { key: "total_calories" as const, label: "Calories", icon: Flame,     color: "#fb923c", iconBg: "rgba(251,146,60,0.08)",  iconBorder: "rgba(251,146,60,0.15)"  },
  { key: "protein"        as const, label: "Protein",  icon: Droplets,  color: "#60a5fa", iconBg: "rgba(96,165,250,0.08)",  iconBorder: "rgba(96,165,250,0.15)"  },
  { key: "carbs"          as const, label: "Carbs",    icon: Wheat,     color: "#fbbf24", iconBg: "rgba(251,191,36,0.08)",  iconBorder: "rgba(251,191,36,0.15)"  },
  { key: "fat"            as const, label: "Fat",      icon: CircleDot, color: "#34d399", iconBg: "rgba(52,211,153,0.08)",  iconBorder: "rgba(52,211,153,0.15)"  },
];

export function PlanClient({ plan }: { plan: Plan }) {
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [expandedMealId, setExpandedMealId] = useState<string | null>(null);

  const days = (plan?.plan_days || []).sort((a, b) => a.day_number - b.day_number);
  const currentDay = days[activeDayIdx];

  if (!currentDay) return null;

  return (
    <div className="flex flex-col gap-8">
      {/* Day selector */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveDayIdx((p) => Math.max(0, p - 1))}
          disabled={activeDayIdx === 0}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-20"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "#6a7a6a",
          }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex gap-2 overflow-x-auto flex-1 justify-start sm:justify-center px-1">
          {days.map((day, idx) => (
            <button
              key={day.id}
              onClick={() => {
                setActiveDayIdx(idx);
                setExpandedMealId(null);
              }}
              className="px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap"
              style={
                activeDayIdx === idx
                  ? { background: "#b4f55a", color: "#050a05" }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      color: "#5a6a5a",
                      border: "1px solid rgba(255,255,255,0.04)",
                    }
              }
            >
              Day {day.day_number}
            </button>
          ))}
        </div>

        <button
          onClick={() => setActiveDayIdx((p) => Math.min(days.length - 1, p + 1))}
          disabled={activeDayIdx === days.length - 1}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-20"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "#6a7a6a",
          }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Daily summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {macroMeta.map((m) => {
          const val =
            m.key === "total_calories"
              ? `${currentDay.total_calories} kcal`
              : sumMacro(currentDay.meals, m.key);
          return (
            <div
              key={m.label}
              className="p-4 rounded-xl flex items-center gap-3"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: m.iconBg, border: `1px solid ${m.iconBorder}`, color: m.color }}
              >
                <m.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5 truncate" style={{ color: "#2a3a2a" }}>
                  {m.label}
                </p>
                <p className="text-sm font-bold text-white truncate">{val}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Meal cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDayIdx}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          {mealMeta.map((meta) => {
            const meal = currentDay.meals.find((m) => m.meal_type === meta.type);
            if (!meal) return null;
            const isExpanded = expandedMealId === meal.id;

            return (
              <motion.div
                layout
                key={meal.id}
                className="p-6 rounded-3xl transition-colors duration-300"
                style={{
                  background: isExpanded ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isExpanded ? "rgba(180,245,90,0.18)" : "rgba(255,255,255,0.05)"}`,
                }}
              >
                {/* Meal header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center"
                      style={{ background: meta.iconBg, border: `1px solid ${meta.iconBorder}` }}
                    >
                      <meta.icon className="w-5 h-5" style={{ color: meta.color }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#3a4a3a" }}>
                        {meta.label}
                      </p>
                      <h3 className="text-lg font-bold text-white leading-tight">{meal.name}</h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedMealId(isExpanded ? null : meal.id)}
                    className="mt-1 p-2 rounded-xl transition-all"
                    style={
                      isExpanded
                        ? { background: "#b4f55a", color: "#050a05" }
                        : {
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            color: "#4a5a4a",
                          }
                    }
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm leading-relaxed mb-5 line-clamp-2" style={{ color: "#4a5a4a" }}>
                  {meal.description}
                </p>

                {/* Macro row */}
                <div
                  className="flex items-center gap-4 py-3 mb-4"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <MiniMacro value={meal.protein} label="P" />
                  <MiniMacro value={meal.carbs} label="C" />
                  <MiniMacro value={meal.fat} label="F" />
                  <div
                    className="ml-auto px-3 py-1 rounded-lg text-sm font-bold text-white"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {meal.calories} kcal
                  </div>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden space-y-5 pt-2"
                    >
                      {/* Ingredients */}
                      <div>
                        <h4
                          className="text-[10px] font-bold uppercase tracking-widest mb-3"
                          style={{ color: "#b4f55a" }}
                        >
                          Ingredients
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {meal.ingredients.map((ing, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 rounded-xl text-xs"
                              style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.05)",
                                color: "#c4cec4",
                              }}
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Instructions */}
                      <div>
                        <h4
                          className="text-[10px] font-bold uppercase tracking-widest mb-3"
                          style={{ color: "#b4f55a" }}
                        >
                          Preparation
                        </h4>
                        <p
                          className="text-sm leading-relaxed whitespace-pre-wrap"
                          style={{ color: "#5a6a5a" }}
                        >
                          {meal.instructions}
                        </p>
                      </div>

                      {/* Metabolic note */}
                      <div
                        className="p-4 rounded-2xl flex gap-3 items-center"
                        style={{
                          background: "rgba(180,245,90,0.03)",
                          border: "1px solid rgba(180,245,90,0.08)",
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#b4f55a" }} />
                        <p className="text-[11px] font-medium" style={{ color: "rgba(180,245,90,0.7)" }}>
                          Perfectly aligned with your metabolic profile and goal pace.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SummaryStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div
      className="p-4 rounded-2xl flex items-center gap-3"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div
        className="p-2 rounded-xl shrink-0"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-widest truncate" style={{ color: "#2a3a2a" }}>
          {label}
        </p>
        <p className="text-sm font-bold text-white truncate">{value}</p>
      </div>
    </div>
  );
}

function MiniMacro({ value, label }: { value?: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold"
        style={{ background: "rgba(255,255,255,0.04)", color: "#4a5a4a" }}
      >
        {label}
      </div>
      <span className="text-xs font-semibold" style={{ color: "#8a9a8a" }}>
        {value || "—"}
      </span>
    </div>
  );
}

function sumMacro(meals: Meal[], key: "protein" | "carbs" | "fat"): string {
  let total = 0;
  meals.forEach((m) => {
    const val = m[key];
    if (val) {
      const num = parseInt(val, 10);
      if (!isNaN(num)) total += num;
    }
  });
  return total > 0 ? `${total}g` : "—";
}
