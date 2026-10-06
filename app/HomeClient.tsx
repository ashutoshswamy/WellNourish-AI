"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useUser } from "@/components/providers/AuthProvider";
import { NutritionLabel } from "@/components/global/NutritionLabel";

const goals = [
  { label: "Fat loss", cal: 1800, protein: "160 g", carbs: "160 g", fat: "60 g" },
  { label: "Muscle gain", cal: 2800, protein: "210 g", carbs: "280 g", fat: "85 g" },
  { label: "Maintenance", cal: 2200, protein: "140 g", carbs: "240 g", fat: "75 g" },
];

const sampleDay = [
  { type: "Breakfast", time: "8:00", name: "Spinach & feta egg wrap", desc: "Whole-wheat wrap, scrambled eggs, spinach, feta, hot sauce.", kcal: 420, protein: 28, carbs: 38 },
  { type: "Lunch", time: "12:30", name: "Grilled chicken bowl", desc: "Brown rice, chicken thigh, roasted sweet potato, avocado, lime-tahini.", kcal: 680, protein: 48, carbs: 62 },
  { type: "Snack", time: "16:00", name: "Greek yogurt & berries", desc: "Full-fat yogurt, mixed berries, walnuts, raw honey.", kcal: 280, protein: 18, carbs: 30 },
  { type: "Dinner", time: "19:30", name: "Salmon with roasted veg", desc: "Pan-seared salmon over broccoli, bell pepper and quinoa.", kcal: 770, protein: 48, carbs: 55 },
];

const steps = [
  { title: "Tell us about you", desc: "Age, weight, height, activity, goal, allergies and the cuisines you like. About two minutes." },
  { title: "Get your week", desc: "Your calorie and macro targets are calculated, then turned into seven days of meals with recipes and portions." },
  { title: "Cook and shop", desc: "Follow the plan day by day and tick off the grocery list as you shop. Regenerate when your goals change." },
];

const quotes = [
  { quote: "The first meal planner that actually respects my dairy allergy and still gives me food I want to eat.", name: "Priya Sharma", role: "Software engineer" },
  { quote: "I hit my protein target every day last week without thinking about it.", name: "Marcus Chen", role: "Fitness coach" },
  { quote: "A full week of family dinners in under a minute. That alone saves my Sunday.", name: "Aisha Patel", role: "Product designer" },
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
  const goal = goals[goalIdx];
  const dayTotal = sampleDay.reduce((s, m) => s + m.kcal, 0);
  const cta = isSignedIn ? { href: "/dashboard", label: "Open dashboard" } : { href: "/sign-up", label: "Build my plan" };

  return (
    <div className="flex flex-col gap-28 pb-8 md:gap-36">
      {/* Hero */}
      <section className="grid items-center gap-12 pt-12 md:pt-20 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div>
          <h1 className="display rise text-[clamp(2.6rem,5.2vw,4.4rem)]">
            Eat for the body you{" "}
            <span className="bg-[linear-gradient(transparent_60%,var(--accent)_60%,var(--accent)_92%,transparent_92%)] px-1">actually</span>{" "}
            have.
          </h1>
          <p className="rise mt-6 max-w-lg text-lg leading-relaxed text-ink-2" style={{ "--i": 1 } as React.CSSProperties}>
            Share your goals, allergies and routine. Get a 7-day meal plan with exact macros and a grocery list.
          </p>
          <div className="rise mt-9 flex flex-wrap gap-3" style={{ "--i": 2 } as React.CSSProperties}>
            <Link href={cta.href} className="btn btn-primary group h-12 px-6 text-[0.95rem]">
              {cta.label}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href="#sample-day" className="btn btn-secondary h-12 px-6 text-[0.95rem]">
              See a sample day
            </a>
          </div>
        </div>

        <div className="rise mx-auto w-full max-w-sm lg:mr-0" style={{ "--i": 3 } as React.CSSProperties}>
          <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Choose a goal">
            {goals.map((g, i) => (
              <button key={g.label} className="choice" aria-pressed={i === goalIdx} onClick={() => setGoalIdx(i)}>
                {g.label}
              </button>
            ))}
          </div>
          <NutritionLabel
            tickKey={goalIdx}
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

      {/* Sample day: column widths follow each meal's share of the day's calories */}
      <section id="sample-day" className="reveal scroll-mt-24">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-3">Sample day</p>
        <h2 className="display max-w-2xl text-[clamp(2rem,3.6vw,3rem)]">A single day, fully mapped.</h2>
        <p className="mt-4 max-w-xl text-ink-2">Every meal sized to your targets. Wider meals carry more of the day&apos;s calories.</p>

        <div
          className="mt-10 grid grid-cols-1 gap-3 md:[grid-template-columns:var(--cols)]"
          style={{ "--cols": sampleDay.map((m) => `${m.kcal}fr`).join(" ") } as React.CSSProperties}
        >
          {sampleDay.map((m) => (
            <article key={m.type} className="card flex flex-col p-5">
              <div className="flex items-baseline justify-between gap-2 font-mono text-xs text-ink-3">
                <span>{m.time}</span>
                <span>{Math.round((m.kcal / dayTotal) * 100)}%</span>
              </div>
              <div className="mt-1.5 h-1 rounded-full bg-accent md:hidden" style={{ width: `${(m.kcal / dayTotal) * 100}%` }} />
              <p className="mt-5 text-sm font-semibold text-ink-2">{m.type}</p>
              <h3 className="mt-1 text-lg font-semibold leading-snug">{m.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{m.desc}</p>
              <p className="mt-auto pt-5 font-mono text-sm tabular-nums">
                <span className="font-semibold">{m.kcal} kcal</span>
                <span className="text-ink-3"> / {m.protein}g P / {m.carbs}g C</span>
              </p>
            </article>
          ))}
        </div>
        <p className="mt-4 font-mono text-sm tabular-nums text-ink-2">
          Daily total <span className="font-semibold text-ink">{dayTotal.toLocaleString("en-US")} kcal</span>, {sampleDay.reduce((s, m) => s + m.protein, 0)} g protein,{" "}
          {sampleDay.reduce((s, m) => s + m.carbs, 0)} g carbs
        </p>
      </section>

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

      {/* Testimonials: one lead quote, two supporting */}
      <section className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
        <figure className="reveal">
          <blockquote className="display text-[clamp(1.6rem,2.8vw,2.4rem)] font-bold leading-tight [font-stretch:105%]">
            &ldquo;{quotes[0].quote}&rdquo;
          </blockquote>
          <figcaption className="mt-6 text-ink-2">
            <span className="font-semibold text-ink">{quotes[0].name}</span>, {quotes[0].role}
          </figcaption>
        </figure>
        <div className="space-y-8 lg:border-l lg:border-line lg:pl-10">
          {quotes.slice(1).map((q) => (
            <figure key={q.name} className="reveal">
              <blockquote className="leading-relaxed">&ldquo;{q.quote}&rdquo;</blockquote>
              <figcaption className="mt-3 text-sm text-ink-2">
                <span className="font-semibold text-ink">{q.name}</span>, {q.role}
              </figcaption>
            </figure>
          ))}
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
