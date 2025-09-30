import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: {
    default: "WellNourish AI - Personal AI-Powered Diet & Workout Planner",
    template: "%s | WellNourish AI",
  },
  description:
    "Transform your health with WellNourish AI - the smartest personal diet and workout planner. Get customized nutrition plans and fitness routines powered by artificial intelligence, tailored specifically for your goals, lifestyle, and preferences.",
  keywords: [
    "AI diet planner",
    "workout planner",
    "nutrition plan",
    "fitness tracker",
    "personalized diet",
    "AI health coach",
    "meal planning",
    "fitness goals",
    "healthy lifestyle",
    "wellness app",
  ],
  authors: [{ name: "WellNourish AI Team" }],
  creator: "WellNourish AI",
  publisher: "WellNourish AI",
  metadataBase: new URL("https://wellnourish-ai.vercel.app"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wellnourish-ai.vercel.app",
    siteName: "WellNourish AI",
    title: "WellNourish AI - Personal AI-Powered Diet & Workout Planner",
    description:
      "Transform your health with WellNourish AI - the smartest personal diet and workout planner. Get customized nutrition plans and fitness routines powered by artificial intelligence.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "WellNourish AI - Personal AI-Powered Health Planner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WellNourish AI - Personal AI-Powered Diet & Workout Planner",
    description:
      "Transform your health with WellNourish AI - the smartest personal diet and workout planner.",
    images: ["/og-image.jpg"],
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
  verification: {
    google: "google-site-verification-code", // Add your Google verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#16a34a" />

        {/* Favicon and icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          sizes="16x16"
          type="image/png"
        />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          sizes="32x32"
          type="image/png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "WellNourish AI",
              description:
                "Transform your health with WellNourish AI - the smartest personal diet and workout planner.",
              url: "https://wellnourish-ai.vercel.app",
              applicationCategory: "HealthApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Organization",
                name: "WellNourish AI",
              },
            }),
          }}
        />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <div className="flex-1">{children}</div>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
