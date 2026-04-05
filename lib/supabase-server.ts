import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client with the user's Clerk JWT.
 * This ensures that RLS policies using `(auth.jwt() ->> 'sub')` will work correctly.
 */
export async function createAuthenticatedClient(clerkToken: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${clerkToken}`,
        },
      },
    }
  );
}

/**
 * Creates a Supabase client with the Service Role key.
 * Use ONLY for server-side maintenance tasks that MUST bypass RLS.
 * REQUIRES: SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in environment variables.");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
