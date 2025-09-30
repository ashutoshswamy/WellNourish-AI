import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Test auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Test profiles table access
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("count", { count: "exact", head: true });

    // Test plans table access
    const { data: plansData, error: plansError } = await supabase
      .from("plans")
      .select("count", { count: "exact", head: true });

    // Test a specific profile query (simulating the error case)
    const testUserId = "00000000-0000-0000-0000-000000000000"; // Fake UUID
    const { data: profileTest, error: profileTestError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", testUserId)
      .single();

    return NextResponse.json({
      user: user ? { id: user.id, email: user.email } : null,
      authError: authError
        ? {
            message: authError.message,
            status: authError.status,
          }
        : null,
      profiles: {
        accessible: !profilesError,
        error: profilesError
          ? {
              message: profilesError.message,
              code: profilesError.code,
              details: profilesError.details,
              hint: profilesError.hint,
            }
          : null,
        count: profilesData || "unknown",
      },
      plans: {
        accessible: !plansError,
        error: plansError
          ? {
              message: plansError.message,
              code: plansError.code,
              details: plansError.details,
              hint: plansError.hint,
            }
          : null,
        count: plansData || "unknown",
      },
      profileQueryTest: {
        found: !!profileTest,
        error: profileTestError
          ? {
              message: profileTestError.message,
              code: profileTestError.code,
              details: profileTestError.details,
              hint: profileTestError.hint,
            }
          : null,
      },
    });
  } catch (error) {
    return NextResponse.json({
      error: "Unexpected error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
