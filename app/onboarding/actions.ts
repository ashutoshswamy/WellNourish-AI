import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

// This would be better as a layout or middleware, but for simplicity:
export async function checkSession() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/login")
  }
  return user
}
