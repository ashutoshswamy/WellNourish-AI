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
    <div
      className="flex items-center gap-1 p-1 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <button
        onClick={() => setSort("desc")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
        style={
          current === "desc"
            ? {
                background: "rgba(180,245,90,0.1)",
                color: "#b4f55a",
                border: "1px solid rgba(180,245,90,0.2)",
                borderRadius: "10px",
              }
            : { color: "#3a4a3a" }
        }
      >
        <ArrowDownAZ className="w-3.5 h-3.5" />
        Newest
      </button>
      <button
        onClick={() => setSort("asc")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
        style={
          current === "asc"
            ? {
                background: "rgba(180,245,90,0.1)",
                color: "#b4f55a",
                border: "1px solid rgba(180,245,90,0.2)",
                borderRadius: "10px",
              }
            : { color: "#3a4a3a" }
        }
      >
        <ArrowUpAZ className="w-3.5 h-3.5" />
        Oldest
      </button>
    </div>
  );
}
