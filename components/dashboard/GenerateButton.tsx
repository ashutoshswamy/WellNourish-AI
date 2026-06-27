"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}

export function GenerateButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    if (loading) return;
    gsap.to(btnRef.current, {
      boxShadow: "0 0 32px rgba(180,245,90,0.45)",
      duration: 0.25,
    });
  };
  const handleMouseLeave = () => {
    gsap.to(btnRef.current, {
      boxShadow: "0 0 0px rgba(180,245,90,0)",
      duration: 0.25,
    });
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        redirect: "manual",
      });

      if (res.ok || res.status === 302 || res.status === 0) {
        router.push("/plan");
        router.refresh();
      } else {
        const text = await res.text();
        try {
          const errorData = JSON.parse(text);
          setError(errorData.message || errorData.error || "Failed to generate plan.");
        } catch {
          setError(text || "Failed to generate plan. Please try again.");
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <button
        ref={btnRef}
        type="button"
        onClick={handleGenerate}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full px-8 py-3 rounded-full font-bold text-sm transition-opacity"
        style={{
          background: "#b4f55a",
          color: "#050a05",
          opacity: loading ? 0.5 : 1,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Crafting your plan...
          </>
        ) : (
          <>
            <SparklesIcon className="w-4 h-4" />
            Generate New Plan
          </>
        )}
      </button>
      {error && (
        <p className="text-red-400 text-xs text-center">{error}</p>
      )}
    </div>
  );
}
