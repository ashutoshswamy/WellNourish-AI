// The signature element: a printed nutrition-facts panel, rebuilt for a day of eating.
// `tickKey` remounts the values so they replay the .tick animation when it changes.

interface NutritionLabelProps {
  serving: string;
  calories: number | string;
  rows: { label: string; value: string }[];
  footnote?: string;
  tickKey?: string | number;
  className?: string;
}

export function NutritionLabel({ serving, calories, rows, footnote, tickKey, className = "" }: NutritionLabelProps) {
  return (
    <div className={`border-2 border-ink bg-surface p-4 text-ink sm:p-5 ${className}`} style={{ borderRadius: 4 }}>
      <p className="display text-[2.35rem] leading-[0.95] sm:text-[2.75rem]">Nutrition Facts</p>
      <div className="rule-hair mt-2" />
      <p className="mt-1.5 flex justify-between text-sm font-semibold">
        <span>Per day</span>
        <span key={`s-${tickKey}`} className="tick">{serving}</span>
      </p>
      <div className="rule-xl mt-1.5" />

      <p className="mt-1 text-xs font-bold">Amount per day</p>
      <div className="flex items-end justify-between">
        <span className="display text-3xl [font-stretch:100%]">Calories</span>
        <span key={`c-${tickKey}`} className="tick display font-mono text-5xl tabular-nums [font-stretch:100%]">
          {typeof calories === "number" ? calories.toLocaleString("en-US") : calories}
        </span>
      </div>
      <div className="rule-md mt-1" />

      <dl className="text-sm">
        {rows.map((r, i) => (
          <div key={r.label} className={`flex justify-between py-1.5 ${i ? "border-t border-ink" : ""}`}>
            <dt className="font-bold">{r.label}</dt>
            <dd key={`${r.label}-${tickKey}`} className="tick font-mono tabular-nums" style={{ animationDelay: `${i * 60}ms` }}>
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="rule-md" />
      {footnote && <p className="mt-2 text-[0.72rem] leading-snug text-ink-2">{footnote}</p>}
    </div>
  );
}
