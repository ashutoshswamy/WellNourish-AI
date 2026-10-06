"use client";

import { useState, useEffect, useRef } from "react";
import { Trash2, Loader2, AlertCircle } from "lucide-react";
import { deletePlanAction } from "@/app/history/actions";

interface DeletePlanButtonProps {
  planId: string;
}

export default function DeletePlanButton({ planId }: DeletePlanButtonProps) {
  const [status, setStatus] = useState<"idle" | "confirming" | "deleting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  // A double-click must not arm and confirm in one go
  const armedAt = useRef(0);

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
      armedAt.current = Date.now();
      setStatus("confirming");
      return;
    }

    if (status === "confirming" && Date.now() - armedAt.current > 400) {
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
      aria-label={status === "confirming" ? "Confirm delete" : "Delete plan"}
      className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-sm font-semibold transition-colors ${
        status === "idle"
          ? "text-ink-3 hover:bg-danger-soft hover:text-danger"
          : status === "error"
          ? "bg-danger-soft text-danger"
          : "bg-danger text-paper"
      }`}
    >
      {status === "deleting" ? (
        <Loader2 className="size-4 animate-spin" />
      ) : status === "error" ? (
        <AlertCircle className="size-4" />
      ) : (
        <Trash2 className="size-4" />
      )}
      {status === "confirming" && <span>Delete?</span>}
      {status === "error" && <span className="max-w-[9rem] truncate">{errorMessage}</span>}
    </button>
  );
}
