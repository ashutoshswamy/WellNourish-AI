import { redirect } from "next/navigation";
import { adminDb, getServerUser } from "@/lib/firebase-admin";
import { ProfileForm } from "./ProfileForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false },
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
    <ProfileForm initialData={initialData} />
  );
}
