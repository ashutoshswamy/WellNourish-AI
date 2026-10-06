import Link from "next/link";
import { Leaf } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="WellNourish AI home">
      <span aria-hidden className="grid size-7 place-items-center rounded-full bg-accent text-on-accent">
        <Leaf className="size-4" strokeWidth={2.25} />
      </span>
      <span className="display text-[1.05rem] leading-none">
        WellNourish
        <span className="ml-1 align-top font-mono text-[0.65rem] font-medium tracking-normal text-ink-2 [font-stretch:100%]">
          AI
        </span>
      </span>
    </Link>
  );
}
