import { Metadata } from "next";
import { LegalDoc } from "@/components/global/LegalDoc";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Which cookies WellNourish AI uses, what they do and how to control them.",
  alternates: {
    canonical: "https://wellnourishai.ashutoshswamy.in/cookies",
  },
};

export default function CookiesPage() {
  return (
    <LegalDoc
      title="Cookie Policy"
      intro="We keep cookies to the minimum: one to keep you signed in and one set for anonymous analytics. Here is exactly what each does."
      updated="October 2026"
      contactPrompt="Questions about cookies? Email"
      sections={[
        { title: "What cookies are", content: "Cookies are small text files a website stores in your browser. Similar technologies, like local storage and IndexedDB, keep data on your device in the same way. This page covers all of them." },
        { title: "Essential: staying signed in", content: "When you sign in we set a cookie named \"session\". It is HTTP-only, so page scripts can't read it, and it expires after 5 days. Without it, the dashboard, plans and grocery list can't load. Firebase Authentication also stores your sign-in state in your browser's IndexedDB." },
        { title: "Analytics: Google Analytics", content: "We use Google Analytics to understand which pages people visit and how the site performs. It sets cookies named _ga and _ga_<id>, which last up to 2 years. The data is aggregated and is not used for advertising." },
        { title: "What we don't use", content: "No advertising cookies, no cross-site tracking pixels and no selling of cookie data to third parties." },
        { title: "Managing cookies", content: "You can block or delete cookies in your browser settings. Blocking the session cookie will sign you out and stop the app from working. Blocking analytics cookies has no effect on how the site works. Google also offers an opt-out add-on at tools.google.com/dlpage/gaoptout." },
      ]}
    />
  );
}
