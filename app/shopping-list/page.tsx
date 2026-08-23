import { redirect } from "next/navigation";
import { adminDb, getServerUser } from "@/lib/firebase-admin";
import Link from "next/link";
import { ArrowLeft, ShoppingBasket } from "lucide-react";
import { ShoppingListClient } from "@/components/shopping/ShoppingListClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grocery Shopping List",
  description:
    "View the auto-generated grocery shopping list for your active 7-day meal plan.",
};

export const dynamic = "force-dynamic";

export default async function ShoppingListPage() {
  const user = await getServerUser();
  if (!user) redirect("/");

  const activePlanSnap = await adminDb
    .collection("mealPlans")
    .where("user_id", "==", user.uid)
    .where("status", "==", "active")
    .orderBy("created_at", "desc")
    .limit(1)
    .get();

  if (activePlanSnap.empty) redirect("/dashboard");
  const activePlanId = activePlanSnap.docs[0].id;

  let items: { id: string; item_name: string; is_checked: boolean }[] = [];
  try {
    const itemsSnap = await adminDb
      .collection("shoppingList")
      .where("user_id", "==", user.uid)
      .where("plan_id", "==", activePlanId)
      .orderBy("created_at", "asc")
      .get();

    items = itemsSnap.docs.map((doc) => {
      const data = doc.data();
      return { id: doc.id, item_name: data.item_name, is_checked: data.is_checked };
    });
  } catch (err) {
    console.error("Shopping list fetch error:", err);
  }

  return (
    <div className="flex-1 flex flex-col p-6 md:p-10 w-full">
      <div className="max-w-4xl w-full mx-auto">

        {/* Header */}
        <div className="mb-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm mb-6 group transition-colors"
            style={{ color: "#2a3a2a" }}
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="group-hover:text-white transition-colors">Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(180,245,90,0.07)",
                border: "1px solid rgba(180,245,90,0.12)",
              }}
            >
              <ShoppingBasket className="w-6 h-6" style={{ color: "#b4f55a" }} />
            </div>
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.25em] mb-1"
                style={{ color: "rgba(180,245,90,0.7)" }}
              >
                Grocery
              </p>
              <h1 className="text-3xl font-bold text-white tracking-tight">Shopping List</h1>
              <p className="text-sm mt-0.5" style={{ color: "#3a4a3a" }}>
                Essentials for your current 7-day meal plan.
              </p>
            </div>
          </div>
        </div>

        {/* Client side list handler */}
        <ShoppingListClient initialItems={items} />
      </div>
    </div>
  );
}
