"use client";

import { useRef, useState } from "react";
import { useSwap } from "@/components/global/useSwap";
import { ChevronDown } from "lucide-react";

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

const mealOrder = [
  { type: "breakfast", label: "Breakfast" },
  { type: "lunch", label: "Lunch" },
  { type: "snacks", label: "Snacks" },
  { type: "dinner", label: "Dinner" },
];

export function PlanClient({ plan }: { plan: Plan }) {
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const dayRef = useRef<HTMLDivElement>(null);
  useSwap(dayRef, activeDayIdx, "aside, details");

  const days = [...(plan?.plan_days || [])].sort((a, b) => a.day_number - b.day_number);
  const currentDay = days[activeDayIdx];

  if (!currentDay) return null;

  return (
    <div className="rise mt-10">
      {/* Week strip */}
      <div className="-mx-4 overflow-x-auto px-4 pb-1">
        <div className="flex gap-2" role="tablist" aria-label="Days">
          {days.map((day, idx) => (
            <button
              key={day.id}
              role="tab"
              aria-selected={activeDayIdx === idx}
              onClick={() => setActiveDayIdx(idx)}
              className="choice shrink-0 flex-col gap-0 px-5 py-2 leading-tight"
            >
              <span className="font-semibold">Day {day.day_number}</span>
              <span className="font-mono text-xs tabular-nums opacity-75">{day.total_calories} kcal</span>
            </button>
          ))}
        </div>
      </div>

      <div ref={dayRef} className="mt-8 grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-12">
        {/* Day summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="display text-5xl">Day {currentDay.day_number}</p>
          <dl className="mt-5 divide-y divide-line border-y border-line font-mono text-sm tabular-nums">
            {[
              ["Calories", `${currentDay.total_calories} kcal`],
              ["Protein", sumMacro(currentDay.meals, "protein")],
              ["Carbs", sumMacro(currentDay.meals, "carbs")],
              ["Fat", sumMacro(currentDay.meals, "fat")],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2.5">
                <dt className="text-ink-2">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </aside>

        {/* Meals */}
        <div className="flex flex-col gap-4">
          {mealOrder.map((meta) => {
            const meal = currentDay.meals.find((m) => m.meal_type === meta.type);
            if (!meal) return null;
            return (
              <details key={meal.id} className="card group p-6 open:shadow-[0_16px_40px_-24px_color-mix(in_srgb,var(--kale)_60%,transparent)]">
                <summary className="flex cursor-pointer list-none items-start gap-4 [&::-webkit-details-marker]:hidden">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink-3">{meta.label}</p>
                    <h3 className="mt-1 text-xl font-semibold leading-snug">{meal.name}</h3>
                    <p className="mt-2 line-clamp-2 text-ink-2 group-open:line-clamp-none">{meal.description}</p>
                    <p className="mt-3 font-mono text-sm tabular-nums text-ink-2">
                      <span className="font-semibold text-ink">{meal.calories} kcal</span>
                      {meal.protein && ` / ${meal.protein} P`}
                      {meal.carbs && ` / ${meal.carbs} C`}
                      {meal.fat && ` / ${meal.fat} F`}
                    </p>
                  </div>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line transition-transform group-open:rotate-180">
                    <ChevronDown className="size-4" />
                    <span className="sr-only">Show recipe</span>
                  </span>
                </summary>

                <div className="mt-6 grid gap-8 border-t border-line pt-6 md:grid-cols-[1fr_1.4fr]">
                  <div>
                    <h4 className="font-semibold">Ingredients</h4>
                    <ul className="mt-3 space-y-1.5 text-ink-2">
                      {meal.ingredients.map((ing, i) => (
                        <li key={i} className="flex gap-2.5">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold">Preparation</h4>
                    <p className="mt-3 whitespace-pre-wrap leading-relaxed text-ink-2">{meal.instructions}</p>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </div>
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
  return total > 0 ? `${total} g` : "-";
}
