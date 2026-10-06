"use client";

import { useState } from "react";
import { Check, Copy, Plus, Trash2 } from "lucide-react";

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
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row">
        <form onSubmit={addItem} className="flex flex-1 gap-2">
          <label htmlFor="new-item" className="sr-only">
            Add an item
          </label>
          <input
            id="new-item"
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Add an item, e.g. lemons"
            className="field flex-1"
          />
          <button type="submit" className="btn btn-primary size-11 shrink-0 px-0" aria-label="Add item">
            <Plus className="size-5" />
          </button>
        </form>
        <button onClick={copyToClipboard} className="btn btn-secondary" disabled={!items.length}>
          {isCopying ? <Check className="size-4" /> : <Copy className="size-4" />}
          {isCopying ? "Copied" : "Copy list"}
        </button>
      </div>

      <div className="receipt mt-6 px-6 py-8 drop-shadow-[0_10px_24px_color-mix(in_srgb,var(--kale)_18%,transparent)] sm:px-9">
        <div className="flex items-baseline justify-between font-mono text-sm tabular-nums">
          <span className="uppercase tracking-[0.16em] text-ink-3">Collected</span>
          <span>
            <span className="font-semibold">{checkedCount}</span> / {items.length}
          </span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-sunken" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </div>

        {items.length > 0 ? (
          <ul className="mt-6 border-t border-dashed border-ink-3/60">
            {items.map((item) => (
              <li key={item.id} className="group flex items-center gap-3 border-b border-dashed border-line py-2.5">
                <button
                  onClick={() => toggleItem(item.id, item.is_checked)}
                  role="checkbox"
                  aria-checked={item.is_checked}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span
                    className={`grid size-5 shrink-0 place-items-center rounded-[5px] border-[1.5px] border-ink transition-colors ${
                      item.is_checked ? "bg-ink text-surface" : ""
                    }`}
                  >
                    {item.is_checked && <Check className="size-3.5" strokeWidth={3} />}
                  </span>
                  <span className={`min-w-0 flex-1 truncate font-mono text-[0.9rem] ${item.is_checked ? "text-ink-3 line-through" : ""}`}>
                    {item.item_name}
                  </span>
                  {item.amount && <span className="shrink-0 font-mono text-sm text-ink-3">{item.amount}</span>}
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.item_name}`}
                  className="grid size-8 shrink-0 place-items-center rounded-full text-ink-3 transition hover:bg-danger-soft hover:text-danger sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 border-t border-dashed border-ink-3/60 py-12 text-center">
            <p className="font-semibold">Nothing on the list yet</p>
            <p className="mt-1 text-sm text-ink-2">Add items above, or generate a new plan to fill it.</p>
          </div>
        )}
      </div>
    </div>
  );
}
