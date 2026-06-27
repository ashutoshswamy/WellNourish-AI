"use client";

import { useState, useEffect } from "react";
import { Trash2, Loader2, AlertCircle } from "lucide-react";
import { deletePlanAction } from "@/app/history/actions";

interface DeletePlanButtonProps {
  planId: string;
}

export default function DeletePlanButton({ planId }: DeletePlanButtonProps) {
  const [status, setStatus] = useState<"idle" | "confirming" | "deleting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (status === "confirming") {
      const timer = setTimeout(() => setStatus("idle"), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (status === "idle") {
      setStatus("confirming");
      return;
    }

    if (status === "confirming") {
      setStatus("deleting");
      try {
        const result = await deletePlanAction(planId);
        if (!result.success) {
          setStatus("error");
          setErrorMessage(result.error || "Failed to delete plan");
          setTimeout(() => setStatus("idle"), 3000);
        }
      } catch {
        setStatus("error");
        setErrorMessage("An unexpected error occurred");
        setTimeout(() => setStatus("idle"), 3000);
      }
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={status === "deleting"}
      className="relative flex items-center gap-1.5 px-2 py-1.5 transition-all duration-200"
      style={{
        borderRadius: "10px",
        fontSize: "11px",
        fontWeight: 600,
        cursor: status === "deleting" ? "wait" : "pointer",
        ...(status === "idle"
          ? { color: "rgba(255,255,255,0.15)", background: "transparent" }
          : status === "confirming"
          ? { color: "white", background: "#ef4444" }
          : status === "deleting"
          ? { color: "white", background: "rgba(239,68,68,0.4)" }
          : { color: "#f59e0b", background: "rgba(245,158,11,0.08)" }),
      }}
      title={status === "idle" ? "Delete Plan" : undefined}
    >
      {status === "deleting" ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : status === "error" ? (
        <AlertCircle className="w-3.5 h-3.5" />
      ) : (
        <Trash2
          className={`w-3.5 h-3.5 ${status === "confirming" ? "animate-pulse" : ""}`}
        />
      )}

      {status === "confirming" && (
        <span className="whitespace-nowrap">Confirm?</span>
      )}
      {status === "error" && (
        <span className="truncate max-w-[80px]">{errorMessage}</span>
      )}
    </button>
  );
}
