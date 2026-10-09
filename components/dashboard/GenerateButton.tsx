"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";

export function GenerateButton({ className = "" }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerate = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        redirect: "manual",
      });

      if (res.ok || res.status === 302 || res.status === 0) {
        // Keep the spinner up until /plan replaces this page
        router.push("/plan");
        return;
      }
      const text = await res.text();
      try {
        const errorData = JSON.parse(text);
        setError(errorData.message || errorData.error || "Failed to generate plan.");
      } catch {
        setError(text || "Failed to generate plan. Please try again.");
      }
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    }
    setLoading(false);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <button type="button" onClick={handleGenerate} disabled={loading} className="btn btn-primary w-full" aria-busy={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
        {loading ? "Generating your week…" : "Generate new plan"}
      </button>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
