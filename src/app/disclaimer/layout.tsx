import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Medical Disclaimer - Important Health Information",
  description:
    "Important medical disclaimer for WellNourish AI users. Understand the limitations of AI health advice and the importance of consulting healthcare professionals.",
  path: "/disclaimer",
  keywords: [
    "medical disclaimer",
    "health disclaimer",
    "AI limitations",
    "health advice disclaimer",
    "medical consultation",
    "health warnings",
    "fitness disclaimer",
  ],
});

export default function DisclaimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
