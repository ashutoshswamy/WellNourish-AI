"use client";

import { useRouter, useSearchParams } from "next/navigation";

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
    <div className="flex gap-2" role="group" aria-label="Sort plans">
      <button className="choice" aria-pressed={current === "desc"} onClick={() => setSort("desc")}>
        Newest
      </button>
      <button className="choice" aria-pressed={current === "asc"} onClick={() => setSort("asc")}>
        Oldest
      </button>
    </div>
  );
}
