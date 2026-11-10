"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Egg, Fish, Milk, Nut, Shell, Sprout, Squirrel, Bean, Wheat, type LucideIcon } from "lucide-react";
import { useUser } from "@/components/providers/AuthProvider";
import { Packet } from "@/components/global/Packet";
import { variety, mealVariety, type Variety } from "@/components/global/packet-colors";

const goals = [
  { label: "Fat loss", cal: 1800, protein: "160 g", carbs: "160 g", fat: "60 g" },
  { label: "Muscle gain", cal: 2800, protein: "210 g", carbs: "280 g", fat: "85 g" },
  { label: "Maintenance", cal: 2200, protein: "140 g", carbs: "240 g", fat: "75 g" },
];

const allergens = ["Milk", "Egg", "Wheat", "Soy", "Peanut", "Tree nut", "Fish", "Shellfish", "Sesame"] as const;
type Allergen = (typeof allergens)[number];
const pictograms: Record<Allergen, LucideIcon> = {
  Milk, Egg, Wheat, Soy: Bean, Peanut: Nut, "Tree nut": Squirrel, Fish, Shellfish: Shell, Sesame: Sprout,
};


// Sample data. Fat derived from kcal - 4P - 4C so every row adds up.
type Meal = {
  name: string; kcal: number; protein: number; carbs: number; fat: number;
  desc: string; ingredients: string[]; contains: Allergen[];
};
// Each meal carries an allergen-free alternative the planner swaps in when something it contains is avoided.
const sampleDay: (Meal & { type: string; time: string; alt: Meal })[] = [
  {
    type: "Breakfast", time: "8:00", name: "Spinach & feta egg wrap", kcal: 420, protein: 28, carbs: 38, fat: 17,
    desc: "Scrambled eggs and wilted spinach in a whole-wheat wrap, finished with feta and hot sauce.",
    ingredients: ["2 eggs", "Whole-wheat wrap", "Baby spinach", "Feta, 30 g", "Hot sauce"],
    contains: ["Milk", "Egg", "Wheat"],
    alt: {
      name: "Oats with banana & chia", kcal: 410, protein: 14, carbs: 66, fat: 10,
      desc: "Rolled oats simmered in oat milk, topped with sliced banana and chia seeds.",
      ingredients: ["Rolled oats, 60 g", "Banana", "Chia seeds, 10 g", "Oat milk, 200 ml"],
      contains: [],
    },
  },
  {
    type: "Lunch", time: "12:30", name: "Grilled chicken bowl", kcal: 680, protein: 48, carbs: 62, fat: 27,
    desc: "Brown rice, grilled chicken thigh and roasted sweet potato with avocado and a lime-tahini dressing.",
    ingredients: ["Chicken thigh, 150 g", "Brown rice, 1 cup", "Sweet potato", "Half an avocado", "Lime-tahini"],
    contains: ["Sesame"],
    alt: {
      name: "Lemon chicken rice bowl", kcal: 648, protein: 46, carbs: 62, fat: 24,
      desc: "Brown rice, grilled chicken thigh and roasted sweet potato with avocado and a lemon-olive oil dressing.",
      ingredients: ["Chicken thigh, 150 g", "Brown rice, 1 cup", "Sweet potato", "Half an avocado", "Lemon & olive oil"],
      contains: [],
    },
  },
  {
    type: "Snack", time: "16:00", name: "Greek yogurt & berries", kcal: 280, protein: 18, carbs: 30, fat: 10,
    desc: "Thick yogurt with mixed berries, a handful of walnuts and a little raw honey.",
    ingredients: ["Greek yogurt, 170 g", "Mixed berries", "Walnuts, 15 g", "Raw honey"],
    contains: ["Milk", "Tree nut"],
    alt: {
      name: "Apple & sunflower butter", kcal: 259, protein: 8, carbs: 32, fat: 11,
      desc: "Crisp apple slices with sunflower seed butter and a pinch of cinnamon.",
      ingredients: ["Apple", "Sunflower seed butter, 25 g", "Cinnamon"],
      contains: [],
    },
  },
  {
    type: "Dinner", time: "19:30", name: "Salmon with roasted veg", kcal: 770, protein: 48, carbs: 55, fat: 40,
    desc: "Pan-seared salmon over roasted broccoli and bell pepper, served with quinoa.",
    ingredients: ["Salmon fillet, 160 g", "Quinoa, 1 cup", "Broccoli", "Bell pepper", "Olive oil"],
    contains: ["Fish"],
    alt: {
      name: "Chicken thigh with roasted veg", kcal: 762, protein: 50, carbs: 55, fat: 38,
      desc: "Roasted chicken thigh over broccoli and bell pepper, served with quinoa.",
      ingredients: ["Chicken thigh, 180 g", "Quinoa, 1 cup", "Broccoli", "Bell pepper", "Olive oil"],
      contains: [],
    },
  },
];

const inputs = ["Age", "Sex", "Weight", "Height", "Activity", "Goal", "Diet", "Allergies"];
const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

const steps: { title: string; desc: string; v: Variety; offset: string }[] = [
  { title: "Tell us about you", desc: "Age, weight, height, activity, goal, allergies and the cuisines you like. About two minutes.", v: "squash", offset: "" },
  { title: "Get your week", desc: "Your calorie and macro targets are calculated, then turned into seven days of meals with recipes and portions.", v: "pea", offset: "md:mt-12" },
  { title: "Cook and shop", desc: "Follow the plan day by day and tick off the grocery list as you shop. Regenerate when your goals change.", v: "berry", offset: "md:mt-24" },
];

const promises = [
  { title: "Your data stays yours", desc: "Health metrics are encrypted at rest and never sold." },
  { title: "Regenerate freely", desc: "Plans take seconds. Make a new one whenever you like." },
  { title: "Grounded in guidelines", desc: "Targets follow established nutrition guidelines, adapted to you." },
];

const groceries = ["Chicken thighs, 1.2 kg", "Salmon fillets, 4", "Greek yogurt, 1 kg", "Baby spinach, 2 bags", "Quinoa, 500 g", "Sweet potatoes, 6"];

const headline = ["Your", "week", "of", "meals,", "in", "one", "packet."];

export function HomeClient() {
  const { isSignedIn } = useUser();
  const [goalIdx, setGoalIdx] = useState(0);
  const goal = goals[goalIdx];
  const cta = isSignedIn ? { href: "/dashboard", label: "Open dashboard" } : { href: "/sign-up", label: "Build my plan" };

  return (
    <div className="flex flex-col gap-24 pb-8 pt-6 md:gap-32 md:pt-10">
      {/* Hero: the page opens as one enormous packet front */}
      <section className="packet px-5 pb-10 pt-14 sm:px-10 sm:pb-14 sm:pt-16 lg:px-14" style={variety("tomato")}>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <h1 aria-label="Your week of meals, in one packet." className="display text-[clamp(3rem,7.4vw,6.5rem)]">
              {headline.map((w) => (
                <span key={w} aria-hidden className="mr-[0.2em] inline-block overflow-hidden pb-[0.1em] align-bottom">
                  <span className="w inline-block">{w}</span>
                </span>
              ))}
            </h1>
            <p className="rise mt-7 max-w-md text-lg leading-relaxed">
              Tell us your goal and allergies. Get seven days of meals with exact macros and a grocery list, free.
            </p>
            <div className="rise mt-8 flex flex-wrap gap-3">
              <Link href={cta.href} className="btn group h-14 bg-night px-7 text-base text-on-night hover:opacity-90">
                {cta.label}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a href="#sample-day" className="btn h-14 border-2 border-current px-7 text-base hover:bg-[var(--pk-fg)] hover:text-[var(--pk)]">
                See a sample day
              </a>
            </div>
          </div>

          <div className="packet-back p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Choose a goal">
              {goals.map((g, i) => (
                <button key={g.label} className="choice" aria-pressed={i === goalIdx} onClick={() => setGoalIdx(i)}>
                  {g.label}
                </button>
              ))}
            </div>
            <Packet
              color="squash"
              serving={goal.label}
              calories={goal.cal}
              rows={[
                { label: "Protein", value: goal.protein },
                { label: "Carbs", value: goal.carbs },
                { label: "Fat", value: goal.fat },
                { label: "Meals", value: "4" },
              ]}
              footnote="Sample targets. Yours are calculated from your age, weight, height and activity level."
            />
          </div>
        </div>
      </section>

      {/* How it grows: three packets at stepped heights */}
      <section className="flex flex-col gap-10">
        <h2 className="reveal display max-w-3xl text-[clamp(2.75rem,6vw,5rem)]">From profile to plate in one pass.</h2>
        <ol className="grid gap-4 md:grid-cols-3 md:items-start">
          {steps.map((st, i) => (
            <li key={st.title} className={`reveal packet p-6 pt-11 sm:p-8 sm:pt-12 ${st.offset}`} style={variety(st.v)}>
              <h3 className="display text-3xl sm:text-4xl">{st.title}</h3>
              <p className="mt-3 max-w-sm leading-relaxed">{st.desc}</p>
              {i === 0 && (
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="What we ask">
                  {inputs.map((f) => (
                    <li key={f} className="tag rounded-full bg-black/10 px-3 py-1.5">{f}</li>
                  ))}
                </ul>
              )}
              {i === 1 && (
                <ol aria-hidden className="mt-6 grid grid-cols-7 gap-1.5">
                  {weekDays.map((d, n) => (
                    <li key={n} className={`tag grid aspect-square place-items-center rounded-full ${n === 0 ? "bg-night text-on-night" : "bg-black/10"}`}>
                      {d}
                    </li>
                  ))}
                </ol>
              )}
              {i === 2 && (
                <ul aria-hidden className="mt-6 space-y-2 text-sm font-bold">
                  {["Day 1 cooked", "Groceries ticked"].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <span className="grid size-5 place-items-center rounded-full bg-white text-ink"><Check className="size-3" strokeWidth={3.5} /></span>
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </section>

      <SampleDay />

      {/* Groceries and targets */}
      <section className="grid gap-4 lg:grid-cols-12">
        <div className="reveal packet grid items-center gap-10 p-6 pt-12 sm:p-10 sm:pt-14 lg:col-span-7 lg:grid-cols-[1fr_auto]" style={variety("pea")}>
          <div>
            <h2 className="display text-[clamp(2.25rem,4vw,3.5rem)]">Your grocery list writes itself.</h2>
            <p className="mt-3 max-w-sm">Every ingredient across the week, combined into one list you can tick off in the store.</p>
          </div>
          <div className="receipt mx-auto w-full max-w-xs px-6 py-7 text-sm text-ink shadow-[0_24px_40px_-24px_rgb(23_19_31/0.6)]">
            <p className="tag text-center text-ink-3">Week of groceries</p>
            <ul className="mt-4 space-y-2 font-medium">
              {groceries.map((g, i) => (
                <li key={g} className={`flex items-center gap-2.5 ${i < 2 ? "text-ink-3 line-through" : ""}`}>
                  <span className={`grid size-4 shrink-0 place-items-center rounded-full border-2 border-ink ${i < 2 ? "bg-ink text-surface" : ""}`}>
                    {i < 2 && <Check className="size-2.5" strokeWidth={4} />}
                  </span>
                  {g}
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t-2 border-dashed border-line pt-3 text-xs text-ink-3">Sample list: 2 of 24 collected</p>
          </div>
        </div>

        <div className="reveal packet p-6 pt-12 sm:p-10 sm:pt-14 lg:col-span-5" style={variety("sky")}>
          <h2 className="display text-[clamp(2.25rem,4vw,3.5rem)]">Targets from your numbers.</h2>
          <p className="mt-3 max-w-sm">Not a round-number guess. Your stats go in, a daily target comes out.</p>
          <dl className="mt-7 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-[14px] bg-surface p-5 text-sm font-medium tabular-nums text-ink">
            <dt className="text-ink-3">Age</dt><dd>29, male</dd>
            <dt className="text-ink-3">Weight</dt><dd>72 kg</dd>
            <dt className="text-ink-3">Height</dt><dd>176 cm</dd>
            <dt className="text-ink-3">Activity</dt><dd>Moderate</dd>
            <dt className="text-ink-3">Goal</dt><dd>Lose 0.5 kg/wk</dd>
            <dt className="col-span-2 my-1 border-t-2 border-dashed border-line" aria-hidden />
            <dt className="font-bold">Target</dt><dd className="display text-2xl">2,104 kcal/day</dd>
          </dl>
        </div>
      </section>

      {/* Closing: a night-coloured packet */}
      <section
        className="packet grid gap-10 p-6 pt-14 sm:p-10 sm:pt-16 lg:grid-cols-[1.3fr_1fr] lg:p-14 lg:pt-16"
        style={{ "--pk": "var(--night)", "--pk-fg": "var(--on-night)" } as React.CSSProperties}
      >
        <div className="flex flex-col justify-between gap-10">
          <h2 className="display text-[clamp(3rem,6vw,5.5rem)]">Stop guessing. Start eating to plan.</h2>
          <div>
            <p className="mb-6 max-w-md text-lg opacity-90">Your first plan is free, no credit card needed.</p>
            <Link href={cta.href} className="btn btn-primary group h-14 px-7 text-base">
              {cta.label}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
        <dl className="flex flex-col justify-center divide-y-2 divide-white/15 self-center">
          {promises.map((p) => (
            <div key={p.title} className="py-5 first:pt-0 last:pb-0">
              <dt className="display text-2xl">{p.title}</dt>
              <dd className="mt-1 opacity-80">{p.desc}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

function SampleDay() {
  const [idx, setIdx] = useState(1);
  const [avoid, setAvoid] = useState<Set<Allergen>>(new Set());
  const clashOf = (m: Meal) => m.contains.filter((a) => avoid.has(a));
  // What the planner would actually serve: the sample meal, or its safe alternative
  const day = sampleDay.map((m) => {
    const hit = clashOf(m);
    return hit.length ? { ...m.alt, type: m.type, time: m.time, swappedFrom: m.name, hit } : { ...m, swappedFrom: null, hit };
  });
  const meal = day[idx];
  const swappedCount = day.filter((m) => m.swappedFrom !== null).length;
  const sum = (k: "kcal" | "protein" | "carbs" | "fat") => day.reduce((t, m) => t + m[k], 0);

  function toggle(a: Allergen) {
    setAvoid((cur) => {
      const next = new Set(cur);
      if (!next.delete(a)) next.add(a);
      return next;
    });
  }

  return (
    <section id="sample-day" className="flex scroll-mt-24 flex-col gap-8">
      <div className="reveal">
        <h2 className="display max-w-3xl text-[clamp(2.75rem,6vw,5rem)]">One day, four packets.</h2>
        <p className="mt-4 max-w-xl text-ink-2">Pick a meal to read its back. Mark what you avoid and the planner leaves it out.</p>
      </div>

      <div className="reveal">
        <p id="avoid-label" className="field-label">I avoid</p>
        <div role="group" aria-labelledby="avoid-label" className="flex flex-wrap gap-2">
          {allergens.map((a) => {
            const Icon = pictograms[a];
            return (
              <button key={a} type="button" className="avoid" aria-pressed={avoid.has(a)} onClick={() => toggle(a)}>
                <Icon className="size-5" strokeWidth={2} aria-hidden />
                <span>{a}</span>
              </button>
            );
          })}
        </div>
        <p aria-live="polite" className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-2">
          <span>
            {avoid.size === 0
              ? "Nothing avoided yet. Every sample meal stays."
              : `${swappedCount} of ${day.length} meals swapped. With your swaps the day is ${sum("kcal")} kcal.`}
          </span>
          {avoid.size > 0 && (
            <button type="button" className="link font-bold text-ink" onClick={() => setAvoid(new Set())}>
              Clear all
            </button>
          )}
        </p>
      </div>

      <div className="reveal grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
        <div
          className="grid grid-cols-2 gap-3 sm:gap-4"
          role="tablist"
          aria-label="Meals in the sample day"
          onKeyDown={(e) => {
            const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
            if (!step) return;
            e.preventDefault();
            const next = (idx + step + day.length) % day.length;
            setIdx(next);
            e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
          }}
        >
          {day.map((m, i) => {
            const swapped = m.swappedFrom !== null;
            return (
              <button
                key={m.type}
                role="tab"
                aria-selected={i === idx}
                aria-controls="sample-meal"
                tabIndex={i === idx ? 0 : -1}
                onClick={() => setIdx(i)}
                style={variety(mealVariety[m.type.toLowerCase()])}
                className={`packet flex min-h-40 flex-col justify-between gap-3 p-3.5 pt-9 text-left sm:p-4 sm:pt-9 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:min-h-52 ${
                  i === idx ? "-translate-y-1.5 ring-4 ring-ink ring-offset-4 ring-offset-paper" : "hover:-translate-y-1"
                }`}
              >
                <span>
                  <span className="tag block opacity-80">{m.type}, {m.time}</span>
                  <span className="mt-1.5 block text-base font-bold leading-snug sm:text-lg">{m.name}</span>
                  {swapped && <span className="mt-1 block text-xs line-through opacity-75">{m.swappedFrom}</span>}
                </span>
                <span className="flex flex-wrap items-end justify-between gap-x-2 gap-y-1.5">
                  <span className="display text-3xl sm:text-4xl">{m.kcal}<span className="tag ml-1.5 opacity-80">kcal</span></span>
                  {swapped && <span className="tag rounded-full bg-night px-2.5 py-1 text-on-night">Swapped</span>}
                </span>
              </button>
            );
          })}
        </div>

        <div id="sample-meal" role="tabpanel" aria-live="polite" className="packet-back">
          <div className="pk-band" style={variety(mealVariety[meal.type.toLowerCase()])}>
            <span>{meal.type}</span>
            <span className="tick">{meal.time}</span>
          </div>
          <div className="p-5 sm:p-7">
            <h3 className="tick display text-[clamp(2.25rem,4vw,3.25rem)]">{meal.name}</h3>
            <p className="tick mt-3 max-w-md leading-relaxed text-ink-2">{meal.desc}</p>

            <dl className="mt-6 grid grid-cols-2 gap-y-4 rounded-[14px] bg-sunken py-3 sm:grid-cols-4 sm:divide-x-2 sm:divide-line">
              {[
                ["Calories", `${meal.kcal}`],
                ["Protein", `${meal.protein} g`],
                ["Carbs", `${meal.carbs} g`],
                ["Fat", `${meal.fat} g`],
              ].map(([k, v]) => (
                <div key={k} className="min-w-0 px-3">
                  <dt className="tag truncate text-ink-3">{k}</dt>
                  <dd className="tick display mt-1 whitespace-nowrap text-[clamp(1.4rem,4.6vw,2rem)] leading-none">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="tick mt-2 text-xs tabular-nums text-ink-3">
              Day total: {sum("kcal")} kcal / {sum("protein")} g protein / {sum("carbs")} g carbs / {sum("fat")} g fat
            </p>

            <div className="perf mt-5 pt-5">
              <p className="tag text-ink-3">Ingredients</p>
              <ul className="tick mt-3 flex flex-wrap gap-2">
                {meal.ingredients.map((ing) => (
                  <li key={ing} className="rounded-full bg-sunken px-3 py-1 text-sm font-medium">{ing}</li>
                ))}
              </ul>
            </div>

            <div className="perf mt-5 pt-5">
              <p className="tag text-ink-3">Contains</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {allergens.map((a) => {
                  const has = meal.contains.includes(a);
                  return (
                    <li key={a} className="contains" data-contains={has}>
                      {a}
                      <span className="sr-only">: {has ? "contains" : "free"}</span>
                    </li>
                  );
                })}
              </ul>
              {meal.swappedFrom && (
                <p className="mt-4 font-bold">
                  Swapped for you: {meal.swappedFrom} has {meal.hit.join(", ").toLowerCase()}.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
