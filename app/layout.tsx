import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/global/Navbar";
import { Footer } from "@/components/global/Footer";
import { CookieConsent } from "@/components/global/CookieConsent";
import { Toaster } from "sileo";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";

// The site uses exactly two families: Bricolage Grotesque for display, DM Sans for everything else.
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz", "wdth"], variable: "--font-bricolage" });
const dmSans = DM_Sans({ subsets: ["latin"], axes: ["opsz"], variable: "--font-dm-sans" });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e8ecee" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0d0f" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://wellnourishai.ashutoshswamy.in"),
  title: {
    default: "WellNourish AI | Personalized AI Nutritionist & Meal Planner",
    template: "%s | WellNourish AI",
  },
  description: "Share your goals, allergies, and lifestyle. Our AI analyzes your unique profile and generates a hyper-personalized 7-day meal plan, down to the grocery list.",
  keywords: ["AI Nutritionist", "Meal Planner", "Personalized Nutrition", "Healthy Eating", "Meal Prep", "Dietary Assistant", "WellNourish AI", "Custom Diet Plan"],
  authors: [{ name: "WellNourish AI Team" }],
  creator: "WellNourish AI",
  publisher: "WellNourish AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "WellNourish AI",
    title: "WellNourish AI | Your Personal AI Nutritionist",
    description: "Get hyper-personalized 7-day meal plans and grocery lists tailored to your unique body metrics and dietary goals.",
    images: [
      {
        url: "/og-image.jpg",
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
    creator: "@ashutoshswamy_",
    images: ["/og-image.jpg"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html
        lang="en"
        className={`${bricolage.variable} ${dmSans.variable} h-full`}
        data-scroll-behavior="smooth"
        suppressHydrationWarning
      >
        <head>
          {/* Apply a pinned theme before first paint so there is no flash */}
          <script
            dangerouslySetInnerHTML={{
              __html: `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`,
            }}
          />
        </head>
        <body className="flex flex-col min-h-dvh bg-paper text-ink font-sans">
          <Navbar />
          <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </main>
          <Footer />
          <CookieConsent />
          <Toaster position="top-center" options={{ fill: "#1c1427" }} />
        </body>
      </html>
    </AuthProvider>
  );
}
