"use server";

import { createClient } from "@/utils/supabase/server";

export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/update-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Check your email for the password reset link." };
}
