import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Navbar } from "@/components/global/Navbar";
import { Footer } from "@/components/global/Footer";
import { AnimatedBackground } from "@/components/global/AnimatedBackground";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://wellnourishai.in"),
  title: {
    default: "WellNourish AI | Personalized AI Nutritionist & Meal Planner",
    template: "%s | WellNourish AI",
  },
  description: "Share your goals, allergies, and lifestyle. Our AI analyzes your unique profile and generates a hyper-personalized 7-day meal plan — down to the grocery list.",
  keywords: ["AI Nutritionist", "Meal Planner", "Personalized Nutrition", "Healthy Eating", "Meal Prep", "Dietary Assistant"],
  authors: [{ name: "WellNourish AI Team" }],
  creator: "WellNourish AI",
  publisher: "WellNourish AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wellnourishai.in",
    siteName: "WellNourish AI",
    title: "WellNourish AI | Your Personal AI Nutritionist",
    description: "Get hyper-personalized 7-day meal plans and grocery lists tailored to your unique body metrics and dietary goals.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "WellNourish AI - Personalized Nutrition",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WellNourish AI | Your Personal AI Nutritionist",
    description: "Hyper-personalized 7-day meal plans and grocery lists tailored specifically to you.",
    images: ["/logo.png"],
    creator: "@wellnourishai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://wellnourishai.in",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" className="h-full antialiased">
        <body className="grain flex flex-col min-h-screen bg-[#060b06] text-[#c4cec4] selection:bg-lime-400/20 selection:text-lime-200">
          <AnimatedBackground />
          <Navbar />
          <main className="flex-1 flex flex-col relative z-10 w-full max-w-7xl mx-auto">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
