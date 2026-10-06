import Link from "next/link";

// Mark: a plate with one portion served, drawn with a conic gradient.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="WellNourish AI home">
      <span
        aria-hidden
        className="size-6 rounded-full ring-2 ring-ink"
        style={{ background: "conic-gradient(var(--accent) 0 30%, var(--ink) 30% 100%)" }}
      />
      <span className="display text-[1.05rem] leading-none">
        WellNourish
        <span className="ml-1 align-top font-mono text-[0.65rem] font-medium tracking-normal text-ink-2 [font-stretch:100%]">
          AI
        </span>
      </span>
    </Link>
  );
}
