import Link from "next/link";
import { Bot } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Bot className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold font-headline tracking-tight bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
        WellNourish AI
      </span>
    </Link>
  );
}
