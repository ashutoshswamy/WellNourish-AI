import { redirect } from "next/navigation";
import { adminDb, getServerUser } from "@/lib/firebase-admin";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
    <div className="mx-auto w-full max-w-2xl py-10 md:py-14">
      <Link href="/plan" className="rise inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
        <ArrowLeft className="size-4" /> Weekly plan
      </Link>
      <h1 className="rise display mt-4 text-[clamp(2rem,4vw,3rem)]">Grocery list</h1>
      <p className="rise mt-2 text-ink-2">Everything for this week&apos;s meals. Tick items off as you shop.</p>

      <ShoppingListClient initialItems={items} />
    </div>
  );
}
