import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wellnourishai.in"),
  manifest: "/site.webmanifest",
  title: {
    default: "WellNourish AI - Personalized Health & Fitness Plans",
    template: "%s | WellNourish AI",
  },
  description: "Generate hyper-personalized diet and workout plans tailored to your unique biology using advanced AI. Achieve your health goals with science-backed precision.",
  keywords: [
    "AI diet plan",
    "AI workout plan",
    "personalized nutrition",
    "custom fitness routine",
    "health app",
    "wellnourish ai",
    "artificial intelligence fitness",
    "meal planner",
    "workout generator",
  ],
  authors: [{ name: "WellNourish AI" }],
  creator: "WellNourish AI",
  publisher: "WellNourish AI",
  openGraph: {
    title: "WellNourish AI - Personalized Health Plans",
    description: "Stop guessing. Start thriving. Get a hyper-personalized nutrition and workout plan tailored to your unique biology.",
    url: "https://wellnourishai.in",
    siteName: "WellNourish AI",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
