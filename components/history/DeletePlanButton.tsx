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

  // Reset to idle after 3 seconds if in confirming state
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
      } catch (err) {
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
      className={`
        relative group flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300
        ${status === "idle" ? "hover:bg-red-500/10 text-slate-500 hover:text-red-400" : ""}
        ${status === "confirming" ? "bg-red-500 text-white shadow-lg shadow-red-500/25" : ""}
        ${status === "deleting" ? "bg-red-500/50 text-white cursor-wait" : ""}
        ${status === "error" ? "bg-amber-500/10 text-amber-500" : ""}
      `}
      title={status === "idle" ? "Delete Plan" : undefined}
    >
      <div className="relative">
        {status === "deleting" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : status === "error" ? (
          <AlertCircle className="w-4 h-4" />
        ) : (
          <Trash2 className={`w-4 h-4 ${status === "confirming" ? "animate-pulse" : ""}`} />
        )}
      </div>

      {status === "confirming" && (
        <span className="text-xs font-bold tracking-tight whitespace-nowrap">
          Are you sure?
        </span>
      )}

      {status === "error" && (
        <span className="text-[10px] font-medium leading-none max-w-[80px] truncate">
          {errorMessage}
        </span>
      )}
    </button>
  );
}
