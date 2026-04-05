import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ProfileForm } from "./ProfileForm";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { data: metrics } = await supabase
    .from("user_metrics")
    .select("*")
    .eq("user_id", userId)
    .single();

  return (
    <div className="flex-1 flex flex-col p-6 md:p-12 w-full justify-center">
      <ProfileForm initialData={metrics || {}} />
    </div>
  );
}
