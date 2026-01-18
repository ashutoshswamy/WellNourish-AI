"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/utils/supabase/server"

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("full_name") as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Send welcome email
  try {
    const { resend } = await import("@/lib/resend");
    const { WelcomeEmail } = await import("@/components/emails/WelcomeEmail");
    
    await resend.emails.send({
      from: 'WellNourish AI <onboarding@wellnourishai.in>',
      to: email,
      subject: 'Welcome to WellNourish AI!',
      react: WelcomeEmail({ fullName }),
    });
  } catch (emailError) {
    console.error("Failed to send welcome email:", emailError);
    // Don't block the signup flow if email fails
  }

  revalidatePath("/", "layout")
  redirect("/onboarding")
}
