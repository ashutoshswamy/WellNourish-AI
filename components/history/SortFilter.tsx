"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpAZ, ArrowDownAZ } from "lucide-react";

export default function SortFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "desc";

  function setSort(value: "asc" | "desc") {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/history?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.05]">
      <button
        onClick={() => setSort("desc")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          current === "desc"
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
            : "text-white/30 hover:text-white/60"
        }`}
      >
        <ArrowDownAZ className="w-3.5 h-3.5" />
        Newest
      </button>
      <button
        onClick={() => setSort("asc")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          current === "asc"
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
            : "text-white/30 hover:text-white/60"
        }`}
      >
        <ArrowUpAZ className="w-3.5 h-3.5" />
        Oldest
      </button>
    </div>
  );
}
