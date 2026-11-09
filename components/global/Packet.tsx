import { variety, type Variety } from "@/components/global/packet-colors";

// The signature element: the front of a seed packet. A colour-drenched field, one huge number,
// and a white back panel holding the macro row. `.tick` marks values a parent can animate with useSwap.

interface PacketProps {
  serving: string;
  calories: number | string;
  rows: { label: string; value: string }[];
  title?: string;
  unit?: string;
  footnote?: string;
  color?: Variety;
  className?: string;
}

export function Packet({ serving, calories, rows, title = "Per day", unit = "kcal", footnote, color = "tomato", className = "" }: PacketProps) {
  return (
    <div className={`packet ${className}`} style={variety(color)}>
      <div className="px-5 pb-5 pt-9 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <p className="tag">{title}</p>
          <p className="tag tick text-right">{serving}</p>
        </div>
        <p className="mt-3 flex items-baseline gap-2.5">
          <span className="tick display text-[clamp(4.75rem,13vw,7rem)] leading-[0.8]">
            {typeof calories === "number" ? calories.toLocaleString("en-US") : calories}
          </span>
          {unit && <span className="text-base font-bold uppercase tracking-[0.12em] opacity-85">{unit}</span>}
        </p>

        <div className="@container mt-6">
          <dl
            className="grid grid-cols-2 gap-2 text-ink @[24rem]:gap-0 @[24rem]:divide-x-2 @[24rem]:divide-line @[24rem]:rounded-[14px] @[24rem]:bg-surface @[24rem]:py-3 @[24rem]:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
            style={{ "--cols": rows.length } as React.CSSProperties}
          >
            {rows.map((r) => (
              <div key={r.label} className="min-w-0 rounded-[14px] bg-surface px-3 py-2.5 @[24rem]:rounded-none @[24rem]:bg-transparent @[24rem]:py-0">
                <dt className="tag truncate text-ink-3">{r.label}</dt>
                <dd className="tick display mt-1 whitespace-nowrap text-[1.5rem] leading-none">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        {footnote && <p className="mt-3 text-xs leading-snug opacity-90">{footnote}</p>}
      </div>
    </div>
  );
}
