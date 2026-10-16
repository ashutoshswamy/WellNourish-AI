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
      intro="We keep cookies to the minimum: essential sign-in cookies, plus optional analytics cookies only after you choose to accept them. Here is exactly what each does."
      updated="October 2026"
      contactPrompt="Questions about cookies? Email"
      sections={[
        { title: "What we use", content: "We use cookies and similar browser storage only for sign-in and optional analytics. Local storage also remembers your theme and whether you accepted or declined analytics; it is not a cookie." },
        { title: "Essential: staying signed in", content: "When you sign in we set an HTTP-only cookie named \"session\" for up to 5 days, plus a readable \"has_session\" marker that helps the client avoid unnecessary session refreshes. Firebase Authentication also stores sign-in state in IndexedDB. These are required for account features." },
        { title: "Optional: Google Analytics", content: "Google Analytics loads only after you click Accept analytics in the consent banner. It may set cookies such as _ga and _ga_<id> to measure visits and site performance. We do not use it for advertising or sell analytics data." },
        { title: "What we don't use", content: "No advertising cookies, no cross-site tracking pixels and no selling of cookie data to third parties." },
        { title: "Managing cookies", content: "Choose Decline analytics in the banner, or delete browser storage and cookies in your browser settings. Declining analytics does not affect the app. Blocking or deleting the session cookie signs you out and stops account features. Google also offers an opt-out add-on at tools.google.com/dlpage/gaoptout." },
      ]}
    />
  );
}
