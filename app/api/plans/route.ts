import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAuthenticatedClient } from "@/lib/supabase-server";

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
    const planId = searchParams.get("id");

    if (!planId) {
      return new NextResponse("Missing plan id", { status: 400 });
    }

    // Only delete if the plan belongs to this user (RLS adds another layer of safety)
    const { error } = await supabase
      .from("meal_plans")
      .delete()
      .eq("id", planId)
      .eq("user_id", userId);

    if (error) {
      console.error("Delete error:", error);
      return new NextResponse("Failed to delete plan", { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Plans API error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

