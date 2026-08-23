import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/session-cookie";

export { SESSION_COOKIE };

function getAdminApp(): App {
  if (getApps().length) return getApps()[0];
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const adminAuth = getAuth(getAdminApp());
export const adminDb = getFirestore(getAdminApp());

/**
 * Verifies the session cookie via the Admin SDK. Middleware only checks the
 * cookie's presence (it can't run the Admin SDK on the Edge runtime), so
 * every server route/page that needs the real user identity calls this.
 */
export async function getServerUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;
  if (!session) return null;

  try {
    return await adminAuth.verifySessionCookie(session, true);
  } catch {
    return null;
  }
}

interface PlanMeal {
  id: string;
  meal_type: string;
  name: string;
  description: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  ingredients: string[];
  instructions: string;
  [key: string]: unknown;
}

interface PlanWithDays {
  id: string;
  user_id: string;
  status: string;
  start_date: string;
  created_at: string;
  plan_days: {
    id: string;
    day_number: number;
    total_calories: number;
    meals: PlanMeal[];
  }[];
  [key: string]: unknown;
}

/** Loads a meal plan doc plus its `days` subcollection, shaped like the old Supabase join (`plan.plan_days[].meals[]`). */
export async function loadPlanWithDays(planId: string): Promise<PlanWithDays | null> {
  const planRef = adminDb.collection("mealPlans").doc(planId);
  const [planSnap, daysSnap] = await Promise.all([
    planRef.get(),
    planRef.collection("days").orderBy("day_number", "asc").get(),
  ]);
  if (!planSnap.exists) return null;

  const plan = planSnap.data() as Record<string, unknown> & {
    created_at?: FirebaseFirestore.Timestamp;
  };
  return {
    id: planSnap.id,
    ...plan,
    created_at: plan.created_at?.toDate().toISOString() ?? new Date().toISOString(),
    plan_days: daysSnap.docs.map((doc) => {
      const day = doc.data();
      return {
        id: doc.id,
        day_number: day.day_number,
        total_calories: day.total_calories,
        meals: (day.meals ?? []).map((m: Record<string, unknown>, mealIdx: number) => ({
          id: `${doc.id}-${mealIdx}`,
          ...m,
        })) as PlanMeal[],
      };
    }),
  } as PlanWithDays;
}

/** Deletes a meal plan along with its `days` subcollection and shopping list items (mirrors the old FK cascade). */
export async function deleteMealPlanCascade(planId: string) {
  const planRef = adminDb.collection("mealPlans").doc(planId);
  const [daysSnap, shoppingSnap] = await Promise.all([
    planRef.collection("days").get(),
    adminDb.collection("shoppingList").where("plan_id", "==", planId).get(),
  ]);

  const batch = adminDb.batch();
  daysSnap.forEach((doc) => batch.delete(doc.ref));
  shoppingSnap.forEach((doc) => batch.delete(doc.ref));
  batch.delete(planRef);
  await batch.commit();
}
