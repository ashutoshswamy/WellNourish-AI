"use server"

import { revalidatePath } from "next/cache"

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

  // Email confirmation is handled by Supabase automatically
  // The user will receive a confirmation email with a link to verify their account
  
  revalidatePath("/", "layout")
  
  // Return success - don't redirect, let the UI show the confirmation message
  return { success: true, message: "Please check your email to confirm your account." }
}
