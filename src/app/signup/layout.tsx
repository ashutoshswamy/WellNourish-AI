import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Sign Up - Start Your Health Journey",
  description:
    "Create your free WellNourish AI account and begin your personalized journey to better health with AI-powered diet and workout planning.",
  path: "/signup",
  noIndex: true,
  noFollow: true,
});

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
