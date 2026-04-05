import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAuthenticatedClient } from "@/lib/supabase-server";
import { z } from "zod";

const shoppingItemSchema = z.object({
  item_name: z.string().min(1).max(200),
  is_checked: z.boolean().optional(),
  plan_id: z.string().uuid().optional(),
});

export async function POST(req: Request) {
  try {
    const { userId, getToken } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const supabaseAccessToken = await getToken({ template: "supabase" });
    if (!supabaseAccessToken) {
      return new NextResponse("Failed to synchronize authentication", { status: 500 });
    }
    const supabase = await createAuthenticatedClient(supabaseAccessToken);

    const body = await req.json();
    const validated = shoppingItemSchema.parse(body);

    const { data, error } = await supabase
      .from("shopping_list")
      .insert({
        ...validated,
        user_id: userId,
        is_checked: validated.is_checked ?? false,
      })
      .select()
      .single();

    if (error) {
      console.error("Shopping list POST error:", error);
      return new NextResponse("Failed to add item", { status: 500 });
    }

    return NextResponse.json(data);
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
    const { userId, getToken } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const supabaseAccessToken = await getToken({ template: "supabase" });
    if (!supabaseAccessToken) {
      return new NextResponse("Failed to synchronize authentication", { status: 500 });
    }
    const supabase = await createAuthenticatedClient(supabaseAccessToken);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new NextResponse("Missing item id", { status: 400 });

    const body = await req.json();
    const { is_checked } = body;

    const { error } = await supabase
      .from("shopping_list")
      .update({ is_checked })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("Shopping list PATCH error:", error);
      return new NextResponse("Failed to update item", { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Shopping list PATCH internal error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId, getToken } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const supabaseAccessToken = await getToken({ template: "supabase" });
    if (!supabaseAccessToken) {
      return new NextResponse("Failed to synchronize authentication", { status: 500 });
    }
    const supabase = await createAuthenticatedClient(supabaseAccessToken);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new NextResponse("Missing item id", { status: 400 });

    const { error } = await supabase
      .from("shopping_list")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("Shopping list DELETE error:", error);
      return new NextResponse("Failed to delete item", { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Shopping list DELETE internal error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
