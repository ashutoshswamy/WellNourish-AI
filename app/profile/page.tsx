import { redirect } from "next/navigation";
import { adminDb, getServerUser } from "@/lib/firebase-admin";
import { ProfileForm } from "./ProfileForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Settings",
  description: "Update your target weight, height, health goals, and allergies.",
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getServerUser();
  if (!user) redirect("/");

  const metricsSnap = await adminDb.collection("userMetrics").doc(user.uid).get();
  const initialData = JSON.parse(JSON.stringify(metricsSnap.data() || {}));

  return (
    <div className="flex-1 flex flex-col p-6 md:p-12 w-full justify-center">
      <ProfileForm initialData={initialData} />
    </div>
  );
}
