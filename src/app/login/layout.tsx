import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Login - Access Your Personal Health Dashboard",
  description:
    "Sign in to your WellNourish AI account to access your personalized diet plans, workout routines, and health tracking dashboard.",
  path: "/login",
  noIndex: true,
  noFollow: true,
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
