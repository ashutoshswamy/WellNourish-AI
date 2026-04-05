"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  { type: "breakfast", label: "Breakfast", icon: Coffee, color: "#facc15", time: "Morning" },
  { type: "lunch", label: "Lunch", icon: Sun, color: "#10b981", time: "Afternoon" },
  { type: "dinner", label: "Dinner", icon: Moon, color: "#818cf8", time: "Evening" },
  { type: "snacks", label: "Snacks", icon: Cookie, color: "#fb923c", time: "Anytime" },
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
          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex gap-2 overflow-x-auto scrollbar-none flex-1 justify-center px-4">
          {days.map((day, idx) => (
            <button
              key={day.id}
              onClick={() => {
                setActiveDayIdx(idx);
                setExpandedMealId(null);
              }}
              className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeDayIdx === idx
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              Day {day.day_number}
            </button>
          ))}
        </div>

        <button
          onClick={() => setActiveDayIdx((p) => Math.min(days.length - 1, p + 1))}
          disabled={activeDayIdx === days.length - 1}
          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Daily summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryStat icon={<Flame className="text-orange-400" />} label="Target" value={`${currentDay.total_calories} kcal`} />
        <SummaryStat icon={<Droplets className="text-blue-400" />} label="Protein" value={sumMacro(currentDay.meals, "protein")} />
        <SummaryStat icon={<Wheat className="text-amber-400" />} label="Carbs" value={sumMacro(currentDay.meals, "carbs")} />
        <SummaryStat icon={<CircleDot className="text-emerald-400" />} label="Fat" value={sumMacro(currentDay.meals, "fat")} />
      </div>

      {/* Meal cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDayIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {mealMeta.map((meta) => {
            const meal = currentDay.meals.find(m => m.meal_type === meta.type);
            if (!meal) return null;

            const isExpanded = expandedMealId === meal.id;

            return (
              <motion.div
                layout
                key={meal.id}
                className={`group p-6 rounded-3xl border transition-all duration-500 overflow-hidden ${
                  isExpanded 
                    ? "bg-white/[0.04] border-emerald-500/30 ring-1 ring-emerald-500/10" 
                    : "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-white/5 text-slate-400">
                      <meta.icon className="w-5 h-5" style={{ color: isExpanded ? 'white' : meta.color }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{meta.label}</p>
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">{meal.name}</h3>
                    </div>
                  </div>
                  <button 
                    onClick={() => setExpandedMealId(isExpanded ? null : meal.id)}
                    className={`mt-2 p-2 rounded-xl transition-all ${isExpanded ? 'bg-emerald-500 text-black' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed font-light mb-6 line-clamp-2">
                  {meal.description}
                </p>

                <div className="flex items-center gap-4 py-4 border-y border-white/[0.05] mb-6">
                   <MiniMacro value={meal.protein} label="P" />
                   <MiniMacro value={meal.carbs} label="C" />
                   <MiniMacro value={meal.fat} label="F" />
                   <div className="ml-auto text-sm font-bold text-white px-3 py-1 rounded-lg bg-white/5">
                      {meal.calories} kcal
                   </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-6 pt-4"
                    >
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3">Composition</h4>
                        <div className="flex flex-wrap gap-2">
                          {meal.ingredients.map((ing, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 font-light">
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3">Preparation</h4>
                        <p className="text-sm text-slate-400 leading-relaxed font-light whitespace-pre-wrap">
                          {meal.instructions}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex gap-3 items-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <p className="text-[11px] text-emerald-400/80 font-medium">Perfectly aligned with your metabolic profile and goal speed.</p>
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

function SummaryStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string; }) {
  return (
    <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-4">
      <div className="p-3 rounded-2xl bg-white/5">{icon}</div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">{label}</p>
        <p className="text-base font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

function MiniMacro({ value, label }: { value?: string; label: string; }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-[10px] font-bold text-slate-500">{label}</div>
      <span className="text-xs font-semibold text-slate-300">{value || "—"}</span>
    </div>
  );
}

function sumMacro(meals: Meal[], key: "protein" | "carbs" | "fat"): string {
  let total = 0;
  meals.forEach(m => {
    const val = m[key];
    if (val) {
      const num = parseInt(val, 10);
      if (!isNaN(num)) total += num;
    }
  });
  return total > 0 ? `${total}g` : "—";
}
