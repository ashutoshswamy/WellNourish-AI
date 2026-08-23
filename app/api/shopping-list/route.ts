import { NextResponse } from "next/server";
import { adminDb, getServerUser } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";

const shoppingItemSchema = z.object({
  item_name: z.string().min(1).max(200),
  is_checked: z.boolean().optional(),
  plan_id: z.string().min(1).optional(),
});

export async function POST(req: Request) {
  try {
    const user = await getServerUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const validated = shoppingItemSchema.parse(body);

    const docData = {
      user_id: user.uid,
      plan_id: validated.plan_id ?? null,
      item_name: validated.item_name,
      is_checked: validated.is_checked ?? false,
      created_at: FieldValue.serverTimestamp(),
    };
    const ref = await adminDb.collection("shoppingList").add(docData);

    return NextResponse.json({
      id: ref.id,
      item_name: docData.item_name,
      is_checked: docData.is_checked,
      plan_id: docData.plan_id,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(err.issues), { status: 400 });
    }
    console.error("Shopping list POST internal error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getServerUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new NextResponse("Missing item id", { status: 400 });

    const { is_checked } = await req.json();

    const ref = adminDb.collection("shoppingList").doc(id);
    const snap = await ref.get();
    if (!snap.exists || snap.data()?.user_id !== user.uid) {
      return new NextResponse("Failed to update item", { status: 500 });
    }

    await ref.update({ is_checked });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Shopping list PATCH internal error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getServerUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new NextResponse("Missing item id", { status: 400 });

    const ref = adminDb.collection("shoppingList").doc(id);
    const snap = await ref.get();
    if (!snap.exists || snap.data()?.user_id !== user.uid) {
      return new NextResponse("Failed to delete item", { status: 500 });
    }

    await ref.delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Shopping list DELETE internal error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
