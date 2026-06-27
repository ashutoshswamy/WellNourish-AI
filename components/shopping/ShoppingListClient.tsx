"use client";

import { useState } from "react";
import {
  Check,
  Trash2,
  Plus,
  Copy,
  CheckCircle2,
  ClipboardList,
  ShoppingBasket,
} from "lucide-react";

interface ShoppingItem {
  id: string;
  item_name: string;
  amount?: string;
  is_checked: boolean;
  category?: string;
}

export function ShoppingListClient({
  initialItems,
}: {
  initialItems: ShoppingItem[];
}) {
  const [items, setItems] = useState<ShoppingItem[]>(initialItems);
  const [newItemName, setNewItemName] = useState("");
  const [isCopying, setIsCopying] = useState(false);

  const toggleItem = async (id: string, currentStatus: boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_checked: !currentStatus } : item
      )
    );
    try {
      const response = await fetch(`/api/shopping-list?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_checked: !currentStatus }),
      });
      if (!response.ok) throw new Error("Failed to update item");
    } catch (error) {
      console.error("Toggle error:", error);
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_checked: currentStatus } : item
        )
      );
    }
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    try {
      const response = await fetch("/api/shopping-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_name: newItemName.trim(), is_checked: false }),
      });
      if (!response.ok) throw new Error("Failed to add item");
      const newItem = await response.json();
      setItems((prev) => [...prev, newItem]);
      setNewItemName("");
    } catch (error) {
      console.error("Add item error:", error);
    }
  };

  const removeItem = async (id: string) => {
    const originalItems = [...items];
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      const response = await fetch(`/api/shopping-list?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete item");
    } catch (error) {
      console.error("Remove item error:", error);
      setItems(originalItems);
    }
  };

  const copyToClipboard = () => {
    const text = items
      .map(
        (item) =>
          `${item.is_checked ? "[x]" : "[ ]"} ${item.item_name}${
            item.amount ? ` (${item.amount})` : ""
          }`
      )
      .join("\n");
    navigator.clipboard.writeText(text);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  const checkedCount = items.filter((i) => i.is_checked).length;
  const progress = items.length > 0 ? (checkedCount / items.length) * 100 : 0;

  return (
    <div className="space-y-6 pb-20">

      {/* Progress Card */}
      <div
        className="p-6 rounded-2xl relative overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <ClipboardList className="w-5 h-5" style={{ color: "#b4f55a" }} />
            <h2 className="text-base font-semibold text-white">Shopping Progress</h2>
          </div>
          <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
        </div>

        <div
          className="h-2 w-full rounded-full overflow-hidden mb-2.5 relative z-10"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #b4f55a, #34d399)",
            }}
          />
        </div>

        <p className="text-xs relative z-10" style={{ color: "#3a4a3a" }}>
          {checkedCount} of {items.length} items collected
        </p>

        {/* Decorative glow */}
        <div
          className="absolute bottom-0 right-0 w-36 h-36 rounded-full"
          style={{
            background: "rgba(180,245,90,0.07)",
            filter: "blur(60px)",
            transform: "translate(30%, 30%)",
          }}
        />
      </div>

      {/* Action bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <form onSubmit={addItem} className="flex-1 relative group">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Add an item..."
            className="w-full text-white text-sm font-medium focus:outline-none"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px",
              padding: "14px 56px 14px 20px",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(180,245,90,0.2)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
            }}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all"
            style={{
              background: "#b4f55a",
              color: "#050a05",
            }}
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>

        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: isCopying ? "#b4f55a" : "#6a7a6a",
            borderColor: isCopying ? "rgba(180,245,90,0.2)" : "rgba(255,255,255,0.06)",
          }}
        >
          {isCopying ? (
            <CheckCircle2 className="w-4 h-4" style={{ color: "#b4f55a" }} />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {isCopying ? "Copied!" : "Copy List"}
        </button>
      </div>

      {/* List Items */}
      <div className="space-y-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            className="group flex items-center gap-4 rounded-2xl transition-all duration-200"
            style={{
              padding: "14px 18px",
              background: item.is_checked
                ? "rgba(255,255,255,0.01)"
                : "rgba(255,255,255,0.025)",
              border: item.is_checked
                ? "1px solid rgba(255,255,255,0.02)"
                : "1px solid rgba(255,255,255,0.06)",
              opacity: item.is_checked ? 0.5 : 1,
            }}
          >
            {/* Checkbox */}
            <button
              onClick={() => toggleItem(item.id, item.is_checked)}
              className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 transition-all"
              style={
                item.is_checked
                  ? { background: "#b4f55a", border: "1px solid #b4f55a", color: "#050a05" }
                  : {
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "transparent",
                    }
              }
            >
              <Check className="w-4 h-4" />
            </button>

            {/* Label & amount */}
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 overflow-hidden min-w-0">
              <span
                className="text-sm font-medium truncate transition-all"
                style={{
                  color: item.is_checked ? "#3a4a3a" : "white",
                  textDecoration: item.is_checked ? "line-through" : "none",
                }}
              >
                {item.item_name}
              </span>
              {item.amount && (
                <span
                  className="text-[11px] font-bold uppercase tracking-wider self-start px-2 py-0.5 rounded-md"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    color: "#3a4a3a",
                  }}
                >
                  {item.amount}
                </span>
              )}
            </div>

            {/* Delete — shown on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 rounded-xl transition-colors"
                style={{ color: "#3a4a3a" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(239,68,68,0.7)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#3a4a3a";
                }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div
            className="text-center py-24 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.01)",
              border: "1px dashed rgba(255,255,255,0.05)",
            }}
          >
            <ShoppingBasket
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: "rgba(255,255,255,0.06)" }}
            />
            <p className="text-sm font-medium" style={{ color: "#2a3a2a" }}>
              Your cart is empty
            </p>
            <p className="text-xs mt-1" style={{ color: "#1a2a1a" }}>
              Add items above or generate a new plan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
