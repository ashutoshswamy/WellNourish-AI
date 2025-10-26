import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read WellNourish AI's privacy policy to understand how we collect, use, and protect your personal information and health data.",
  openGraph: {
    title: "Privacy Policy | WellNourish AI",
    description:
      "Read WellNourish AI's privacy policy to understand how we collect, use, and protect your personal information and health data.",
    url: "https://wellnourishai.in/privacy",
  },
  alternates: {
    canonical: "https://wellnourishai.in/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
