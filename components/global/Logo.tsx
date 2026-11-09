import Link from "next/link";

// A bowl of the week's food: a squash yolk, a pea-green leaf and a berry rising out of a tomato bowl.
// Colours are the printed packet palette, so the mark is identical in light and dark.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="WellNourish AI home">
      <svg aria-hidden viewBox="0 0 44 40" className="h-9 w-10 shrink-0" fill="none">
        <circle cx="13" cy="13" r="7" fill="var(--c-squash)" />
        <path d="M21 17C21 8 26 3 34 3c0 8-5 14-13 14Z" fill="var(--c-pea)" />
        <circle cx="33" cy="15" r="5" fill="var(--c-berry)" />
        <path d="M3 18h38a19 19 0 0 1-38 0Z" fill="var(--c-tomato)" />
        <path d="M9 24.5c1.2 4 4.2 6.8 8.2 7.8" stroke="#fff" strokeOpacity=".55" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <span className="display text-[1.35rem] leading-none">
        WellNourish
        <span className="tag ml-1.5 align-top text-ink-2">AI</span>
      </span>
    </Link>
  );
}
