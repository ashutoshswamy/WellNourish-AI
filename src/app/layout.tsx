import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | WellNourish AI",
    default: "WellNourish AI - Personalized Diet & Workout Plans",
  },
  description:
    "Get AI-powered, personalized diet and workout plans tailored to your health goals, preferences, and lifestyle. Start your journey to a healthier you with WellNourish AI.",
  keywords: [
    "AI diet planner",
    "personalized workout plan",
    "fitness AI",
    "health goals",
    "nutrition plan",
    "custom meal plan",
    "exercise routine",
    "WellNourish AI",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="icon.png"
          type="image/<generated>"
          sizes="<generated>"
        />
        <link
          rel="apple-touch-icon"
          href="apple-icon.png"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
