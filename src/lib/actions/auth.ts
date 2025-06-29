"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema } from "@/lib/zod-schemas";
import type { z } from "zod";

export async function login(values: z.infer<typeof loginSchema>) {
  const supabase = createClient();

  const validatedFields = loginSchema.safeParse(values);
  if (!validatedFields.data) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(values: z.infer<typeof signupSchema>) {
  const supabase = createClient();

  const validatedFields = signupSchema.safeParse(values);
  if (!validatedFields.data) {
    return { error: "Invalid fields" };
  }

  const { displayName, email, password } = validatedFields.data;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
