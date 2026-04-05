"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  Trash2, 
  Plus, 
  Copy, 
  CheckCircle2, 
  ClipboardList,
  ShoppingBasket
} from "lucide-react";

interface ShoppingItem {
  id: string;
  item_name: string;
  amount?: string;
  is_checked: boolean;
  category?: string;
}

export function ShoppingListClient({ initialItems }: { initialItems: ShoppingItem[] }) {
  const [items, setItems] = useState<ShoppingItem[]>(initialItems);
  const [newItemName, setNewItemName] = useState("");
  const [isCopying, setIsCopying] = useState(false);

  const toggleItem = async (id: string, currentStatus: boolean) => {
    // Optimistic update
    setItems(items.map(item => 
      item.id === id ? { ...item, is_checked: !currentStatus } : item
    ));

    try {
      const response = await fetch(`/api/shopping-list?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_checked: !currentStatus })
      });

      if (!response.ok) {
        throw new Error("Failed to update item");
      }
    } catch (error) {
      console.error("Toggle error:", error);
      // Revert on error
      setItems(items.map(item => 
        item.id === id ? { ...item, is_checked: currentStatus } : item
      ));
    }
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      const response = await fetch("/api/shopping-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          item_name: newItemName.trim(), 
          is_checked: false 
        })
      });

      if (!response.ok) {
        throw new Error("Failed to add item");
      }

      const newItem = await response.json();
      setItems([...items, newItem]);
      setNewItemName("");
    } catch (error) {
      console.error("Add item error:", error);
    }
  };

  const removeItem = async (id: string) => {
    const originalItems = [...items];
    setItems(items.filter(item => item.id !== id));

    try {
      const response = await fetch(`/api/shopping-list?id=${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
    } catch (error) {
      console.error("Remove item error:", error);
      setItems(originalItems);
    }
  };

  const copyToClipboard = () => {
    const text = items
      .map(item => `${item.is_checked ? '[x]' : '[ ]'} ${item.item_name}${item.amount ? ` (${item.amount})` : ''}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  const checkedCount = items.filter(i => i.is_checked).length;
  const progress = items.length > 0 ? (checkedCount / items.length) * 100 : 0;

  return (
    <div className="space-y-8 pb-20">
      {/* Progress Card */}
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">List Progress</h2>
          </div>
          <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
        </div>
        
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-2 relative z-10">
          <motion.div 
            className="h-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", bounce: 0, duration: 1 }}
          />
        </div>
        <p className="text-xs text-slate-500 relative z-10">{checkedCount} of {items.length} items collected</p>
        
        {/* Decorative background glow */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form onSubmit={addItem} className="flex-1 w-full relative group">
          <input 
            type="text" 
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Add missing essential..."
            className="w-full bg-white/[0.03] border border-white/[0.08] group-hover:border-white/[0.12] rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all pr-14"
          />
          <button 
            type="submit" 
            className="absolute right-2 top-2 p-2.5 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>

        <button 
          onClick={copyToClipboard}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all font-medium text-sm"
        >
          {isCopying ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          {isCopying ? "Copied!" : "Copy List"}
        </button>
      </div>

      {/* List Items */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                item.is_checked 
                  ? "bg-white/[0.01] border-white/[0.02] opacity-60" 
                  : "bg-white/[0.03] border-white/[0.07] hover:border-emerald-500/20 hover:bg-white/[0.04]"
              }`}
            >
              <button 
                onClick={() => toggleItem(item.id, item.is_checked)}
                className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                  item.is_checked 
                    ? "bg-emerald-500 border-emerald-500 text-black" 
                    : "border-white/20 text-transparent hover:border-emerald-500/50"
                }`}
              >
                <Check className="w-4 h-4" />
              </button>

              <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 overflow-hidden">
                <span className={`text-sm font-medium transition-all truncate ${
                  item.is_checked ? "text-slate-500 line-through" : "text-white"
                }`}>
                  {item.item_name}
                </span>
                {item.amount && (
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-white/5 px-2 py-0.5 rounded-md self-start">
                    {item.amount}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-2.5 rounded-xl hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {items.length === 0 && (
          <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl">
            <ShoppingBasket className="w-12 h-12 text-slate-800 mx-auto mb-4" />
            <p className="text-slate-600 font-light">Your grocery basket is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}


