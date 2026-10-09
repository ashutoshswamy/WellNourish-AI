"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useUser } from "@/components/providers/AuthProvider";
import { NutritionLabel } from "@/components/global/NutritionLabel";
import { useSwap } from "@/components/global/useSwap";

const goals = [
  { label: "Fat loss", cal: 1800, protein: "160 g", carbs: "160 g", fat: "60 g" },
  { label: "Muscle gain", cal: 2800, protein: "210 g", carbs: "280 g", fat: "85 g" },
  { label: "Maintenance", cal: 2200, protein: "140 g", carbs: "240 g", fat: "75 g" },
];

// Fat derived from kcal - 4P - 4C so every row adds up.
const sampleDay = [
  {
    type: "Breakfast", time: "8:00", hour: 8, name: "Spinach & feta egg wrap", kcal: 420, protein: 28, carbs: 38, fat: 17,
    desc: "Scrambled eggs and wilted spinach in a whole-wheat wrap, finished with feta and hot sauce.",
    ingredients: ["2 eggs", "Whole-wheat wrap", "Baby spinach", "Feta, 30 g", "Hot sauce"],
  },
  {
    type: "Lunch", time: "12:30", hour: 12.5, name: "Grilled chicken bowl", kcal: 680, protein: 48, carbs: 62, fat: 27,
    desc: "Brown rice, grilled chicken thigh and roasted sweet potato with avocado and a lime-tahini dressing.",
    ingredients: ["Chicken thigh, 150 g", "Brown rice, 1 cup", "Sweet potato", "Half an avocado", "Lime-tahini"],
  },
  {
    type: "Snack", time: "16:00", hour: 16, name: "Greek yogurt & berries", kcal: 280, protein: 18, carbs: 30, fat: 10,
    desc: "Thick yogurt with mixed berries, a handful of walnuts and a little raw honey.",
    ingredients: ["Greek yogurt, 170 g", "Mixed berries", "Walnuts, 15 g", "Raw honey"],
  },
  {
    type: "Dinner", time: "19:30", hour: 19.5, name: "Salmon with roasted veg", kcal: 770, protein: 48, carbs: 55, fat: 40,
    desc: "Pan-seared salmon over roasted broccoli and bell pepper, served with quinoa.",
    ingredients: ["Salmon fillet, 160 g", "Quinoa, 1 cup", "Broccoli", "Bell pepper", "Olive oil"],
  },
];

const DAY_START = 7;
const DAY_END = 21;

const steps = [
  { title: "Tell us about you", desc: "Age, weight, height, activity, goal, allergies and the cuisines you like. About two minutes." },
  { title: "Get your week", desc: "Your calorie and macro targets are calculated, then turned into seven days of meals with recipes and portions." },
  { title: "Cook and shop", desc: "Follow the plan day by day and tick off the grocery list as you shop. Regenerate when your goals change." },
];


const promises = [
  { title: "Your data stays yours", desc: "Health metrics are encrypted at rest and never sold." },
  { title: "Regenerate freely", desc: "Plans take seconds. Make a new one whenever you like." },
  { title: "Grounded in guidelines", desc: "Targets follow established nutrition guidelines, adapted to you." },
];

const groceries = ["Chicken thighs, 1.2 kg", "Salmon fillets, 4", "Greek yogurt, 1 kg", "Baby spinach, 2 bags", "Quinoa, 500 g", "Sweet potatoes, 6"];

export function HomeClient() {
  const { isSignedIn } = useUser();
  const [goalIdx, setGoalIdx] = useState(0);
  const labelRef = useRef<HTMLDivElement>(null);
  useSwap(labelRef, goalIdx);
  const goal = goals[goalIdx];
  const cta = isSignedIn ? { href: "/dashboard", label: "Open dashboard" } : { href: "/sign-up", label: "Build my plan" };

  return (
    <div className="flex flex-col gap-28 pb-8 md:gap-36">
      {/* Hero */}
      <section className="grid items-center gap-12 pt-12 md:pt-20 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div>
          <h1 className="display rise text-[clamp(2.6rem,5.2vw,4.4rem)]">
            Eat for the body you{" "}
            <span className="hl px-1">actually</span>{" "}
            have.
          </h1>
          <p className="rise mt-6 max-w-lg text-lg leading-relaxed text-ink-2">
            Share your goals, allergies and routine. Get a 7-day meal plan with exact macros and a grocery list.
          </p>
          <div className="rise mt-9 flex flex-wrap gap-3">
            <Link href={cta.href} className="btn btn-primary group h-12 px-6 text-[0.95rem]">
              {cta.label}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href="#sample-day" className="btn btn-secondary h-12 px-6 text-[0.95rem]">
              See a sample day
            </a>
          </div>
        </div>

        <div ref={labelRef} className="rise mx-auto w-full max-w-sm lg:mr-0">
          <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Choose a goal">
            {goals.map((g, i) => (
              <button key={g.label} className="choice" aria-pressed={i === goalIdx} onClick={() => setGoalIdx(i)}>
                {g.label}
              </button>
            ))}
          </div>
          <NutritionLabel
            serving={goal.label}
            calories={goal.cal}
            rows={[
              { label: "Protein", value: goal.protein },
              { label: "Carbohydrate", value: goal.carbs },
              { label: "Total fat", value: goal.fat },
              { label: "Meals", value: "4" },
            ]}
            footnote="Sample targets. Yours are calculated from your age, weight, height and activity level."
          />
        </div>
      </section>

      <SampleDay />

      {/* How it works: a real sequence, so the numbers stay */}
      <section className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <h2 className="display text-[clamp(2rem,3.6vw,3rem)] lg:sticky lg:top-28 lg:self-start">
          From profile to plate in three steps.
        </h2>
        <ol className="space-y-12">
          {steps.map((s, i) => (
            <li key={s.title} className="reveal grid grid-cols-[3.5rem_1fr] gap-4 border-t border-line pt-6">
              <span className="display font-mono text-4xl text-ink-3 [font-stretch:100%]">{i + 1}</span>
              <div>
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 max-w-md leading-relaxed text-ink-2">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Features bento: exactly three cells */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr]">
        <div className="reveal flex flex-col justify-between gap-8 overflow-hidden rounded-2xl bg-kale p-7 text-on-kale md:row-span-2 md:p-9">
          <div>
            <h3 className="display max-w-sm text-3xl md:text-4xl">Your grocery list writes itself.</h3>
            <p className="mt-3 max-w-sm text-on-kale/80">Every ingredient across the week, combined into one list you can tick off in the store.</p>
          </div>
          <div className="receipt mx-auto w-full max-w-xs -rotate-2 px-6 py-7 font-mono text-sm text-ink shadow-[0_24px_48px_-24px_rgb(0_0_0/0.5)]">
            <p className="text-center text-xs uppercase tracking-[0.2em] text-ink-3">Week of groceries</p>
            <ul className="mt-4 space-y-2">
              {groceries.map((g, i) => (
                <li key={g} className={`flex items-center gap-2.5 ${i < 2 ? "text-ink-3 line-through" : ""}`}>
                  <span className={`grid size-4 shrink-0 place-items-center rounded-[4px] border border-ink ${i < 2 ? "bg-ink text-surface" : ""}`}>
                    {i < 2 && <Check className="size-3" strokeWidth={3} />}
                  </span>
                  {g}
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-dashed border-ink-3 pt-3 text-xs text-ink-3">2 of 24 collected</p>
          </div>
        </div>

        <div className="reveal rounded-2xl bg-accent p-7 text-on-accent md:p-9">
          <h3 className="display text-2xl md:text-3xl">Allergies filtered out first.</h3>
          <p className="mt-3 max-w-sm">Ingredients you can&apos;t eat never make it into a recipe.</p>
          <div className="mt-6 flex flex-wrap gap-2 font-mono text-sm">
            {["peanuts", "shellfish", "dairy"].map((a) => (
              <span key={a} className="rounded-full border border-on-accent/40 px-3 py-1 line-through decoration-2">{a}</span>
            ))}
            {["chickpeas", "oat milk", "tofu"].map((a) => (
              <span key={a} className="rounded-full bg-on-accent px-3 py-1 text-accent">{a}</span>
            ))}
          </div>
        </div>

        <div className="reveal card p-7 md:p-9">
          <h3 className="display text-2xl md:text-3xl">Targets from your numbers.</h3>
          <p className="mt-3 max-w-sm text-ink-2">Not a round-number guess. Your stats go in, a daily target comes out.</p>
          <div className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 font-mono text-sm tabular-nums">
            <span className="text-ink-3">age</span><span>29, male</span>
            <span className="text-ink-3">weight</span><span>72 kg</span>
            <span className="text-ink-3">height</span><span>176 cm</span>
            <span className="text-ink-3">activity</span><span>moderate</span>
            <span className="text-ink-3">goal</span><span>lose 0.5 kg/wk</span>
            <span className="col-span-2 my-2 h-px bg-ink" />
            <span className="font-semibold">target</span><span className="font-semibold">2,104 kcal/day</span>
          </div>
        </div>
      </section>

      {/* Closing CTA with the trust promises */}
      <section className="reveal grid gap-10 rounded-2xl bg-kale p-8 text-on-kale md:p-14 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="display text-[clamp(2.2rem,4vw,3.4rem)]">Stop guessing. Start eating to plan.</h2>
          <p className="mt-4 max-w-md text-on-kale/80">Your first plan is free, no credit card needed.</p>
          <Link href={cta.href} className="btn btn-primary group mt-8 h-12 px-6 text-[0.95rem]">
            {cta.label}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <dl className="space-y-6 self-end">
          {promises.map((p) => (
            <div key={p.title} className="border-t border-on-kale/20 pt-4">
              <dt className="font-semibold">{p.title}</dt>
              <dd className="mt-1 text-sm text-on-kale/75">{p.desc}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

function SampleDay() {
  const [idx, setIdx] = useState(1);
  const panelRef = useRef<HTMLDivElement>(null);
  useSwap(panelRef, idx);
  const meal = sampleDay[idx];
  const total = (k: "kcal" | "protein" | "carbs" | "fat") => sampleDay.reduce((s, m) => s + m[k], 0);
  const dayKcal = total("kcal");
  const eatenSoFar = sampleDay.slice(0, idx + 1).reduce((s, m) => s + m.kcal, 0);
  const pos = (h: number) => `${((h - DAY_START) / (DAY_END - DAY_START)) * 100}%`;

  return (
    <section id="sample-day" className="reveal scroll-mt-24">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-3">Sample day</p>
      <h2 className="display max-w-2xl text-[clamp(2rem,3.6vw,3rem)]">A single day, fully mapped.</h2>
      <p className="mt-4 max-w-xl text-ink-2">Pick a meal to see what&apos;s in it and how much of the day it covers.</p>

      <div className="card mt-10 overflow-hidden">
        {/* Clock: meals pinned to the hour they're eaten; the accent line is the day so far */}
        <div className="border-b border-line px-6 pb-6 pt-8 sm:px-12">
          <div
            className="relative h-28"
            role="tablist"
            aria-label="Meals in the sample day"
            onKeyDown={(e) => {
              const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
              if (!step) return;
              e.preventDefault();
              const next = (idx + step + sampleDay.length) % sampleDay.length;
              setIdx(next);
              e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
            }}
          >
            {/* Axis */}
            <div className="absolute inset-x-0 top-20 h-0.5 -translate-y-1/2 rounded-full bg-line" />
            <div
              className="absolute left-0 top-20 h-1 -translate-y-1/2 rounded-full bg-accent transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: pos(meal.hour) }}
            />

            {/* Hour ticks: every hour, labelled every two (just the ends on phones) */}
            {Array.from({ length: DAY_END - DAY_START + 1 }, (_, i) => DAY_START + i).map((h) => (
              <div key={h} className="absolute top-[5.4rem] -translate-x-1/2" style={{ left: pos(h) }}>
                <div className={`mx-auto w-px bg-ink-3 ${h % 2 ? "h-2" : "h-1"}`} />
                {h % 2 === 1 && (
                  <span
                    className={`absolute left-1/2 top-3 -translate-x-1/2 font-mono text-[0.7rem] tabular-nums text-ink-3 ${
                      h === DAY_START || h === DAY_END ? "" : "hidden sm:block"
                    }`}
                  >
                    {h}:00
                  </span>
                )}
              </div>
            ))}

            {/* Time between meals */}
            {sampleDay.slice(1).map((m, i) => {
              const gap = m.hour - sampleDay[i].hour;
              return (
                <span
                  key={m.type}
                  className="absolute top-[3.6rem] hidden -translate-x-1/2 font-mono text-[0.68rem] text-ink-3 sm:block"
                  style={{ left: pos((m.hour + sampleDay[i].hour) / 2) }}
                >
                  {Math.floor(gap)}h{gap % 1 ? ` ${Math.round((gap % 1) * 60)}m` : ""}
                </span>
              );
            })}

            {/* Stems + dots */}
            {sampleDay.map((m, i) => (
              <div key={m.type} className="absolute top-12 -translate-x-1/2" style={{ left: pos(m.hour) }} aria-hidden>
                <div className={`mx-auto h-8 transition-colors ${i === idx ? "w-0.5 bg-ink" : "w-px bg-line"}`} />
                <div
                  className={`mx-auto -mt-[7px] size-3.5 rounded-full border-2 transition-colors duration-300 ${
                    i === idx ? "border-ink bg-ink ring-4 ring-accent" : i < idx ? "border-accent bg-accent" : "border-ink-3 bg-surface"
                  }`}
                />
              </div>
            ))}

            {/* Meal tabs */}
            {sampleDay.map((m, i) => (
              <button
                key={m.type}
                role="tab"
                aria-selected={i === idx}
                aria-controls="sample-meal"
                tabIndex={i === idx ? 0 : -1}
                onClick={() => setIdx(i)}
                className="choice absolute top-0 min-h-0 -translate-x-1/2 flex-col gap-0 bg-surface px-2 py-1.5 leading-tight aria-selected:bg-ink sm:px-4"
                style={{ left: pos(m.hour) }}
              >
                <span className="text-[0.72rem] font-semibold sm:text-sm">{m.type}</span>
                <span className="font-mono text-[0.7rem] tabular-nums opacity-70">{m.time}</span>
              </button>
            ))}
          </div>

          {/* Calories: each segment is one meal, filled up to the selected one */}
          <div className="mt-6 flex h-3 gap-1" aria-hidden>
            {sampleDay.map((m, i) => (
              <button
                key={m.type}
                tabIndex={-1}
                onClick={() => setIdx(i)}
                className={`h-full rounded-full transition-colors duration-300 ${i <= idx ? "bg-accent" : "bg-sunken"} ${i === idx ? "ring-2 ring-ink ring-offset-2 ring-offset-surface" : ""}`}
                style={{ flexGrow: m.kcal }}
              />
            ))}
          </div>
          <p className="mt-3 font-mono text-sm tabular-nums text-ink-2">
            <span className="font-semibold text-ink">{eatenSoFar.toLocaleString("en-US")}</span> of {dayKcal.toLocaleString("en-US")} kcal eaten by {meal.time}
          </p>
        </div>

        {/* Selected meal */}
        <div ref={panelRef} id="sample-meal" role="tabpanel" className="grid gap-8 p-5 sm:p-10 md:grid-cols-[1fr_17rem] md:gap-14">
          <div className="tick">
            <p className="text-sm font-semibold text-ink-3">
              {meal.type}, {meal.time}
            </p>
            <h3 className="display mt-2 text-[clamp(1.6rem,2.6vw,2.2rem)]">{meal.name}</h3>
            <p className="mt-3 max-w-md leading-relaxed text-ink-2">{meal.desc}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {meal.ingredients.map((ing) => (
                <li key={ing} className="rounded-full bg-sunken px-3 py-1 text-sm">
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          <dl className="tick self-start border-y-[5px] border-ink font-mono text-sm tabular-nums">
            <div className="flex items-baseline justify-between border-b border-ink py-2">
              <dt className="font-sans font-bold">Calories</dt>
              <dd className="text-2xl font-semibold">{meal.kcal}</dd>
            </div>
            {(["protein", "carbs", "fat"] as const).map((k) => (
              <div key={k} className="flex justify-between border-b border-line py-2 last:border-b-0">
                <dt className="font-sans font-semibold capitalize">{k}</dt>
                <dd>
                  {meal[k]} g <span className="text-ink-3">/ {total(k)} g</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
