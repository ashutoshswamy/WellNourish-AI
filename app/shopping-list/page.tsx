import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowLeft, ShoppingBasket } from "lucide-react";
import { ShoppingListClient } from "@/components/shopping/ShoppingListClient";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ShoppingListPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  // Fetch the latest active plan for this user
  const { data: activePlan } = await supabase
    .from("meal_plans")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!activePlan) {
    redirect("/dashboard");
  }

  // Fetch shopping list items for this specific plan
  const { data: items, error } = await supabase
    .from("shopping_list")
    .select("*")
    .eq("user_id", userId)
    .eq("plan_id", activePlan.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Shopping list fetch error:", error);
  }

  return (
    <div className="flex-1 flex flex-col p-6 md:p-10 w-full">
      <div className="max-w-4xl w-full mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-emerald-400 transition-colors text-sm mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <ShoppingBasket className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Grocery List</h1>
              <p className="text-slate-500 text-sm">Essentials for your current 7-day meal plan.</p>
            </div>
          </div>
        </div>

        {/* Client side list handler */}
        <ShoppingListClient initialItems={items || []} />
      </div>
    </div>
  );
}
