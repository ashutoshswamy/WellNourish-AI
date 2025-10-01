import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Privacy Policy
          </CardTitle>
          <p className="text-center text-muted-foreground">WellNourish AI</p>
          <p className="text-center text-sm text-muted-foreground">
            Last Updated: October 1, 2025
          </p>
        </CardHeader>
        <CardContent className="prose prose-slate max-w-none">
          <p className="text-lg mb-6">
            Your privacy is important to us. This Privacy Policy explains how
            WellNourish AI collects, uses, and protects your data.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              1. Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Personal Data:</h3>
                <p>Name, age, gender, contact details (if provided).</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Health Data:</h3>
                <p>
                  Dietary preferences, allergies, weight, height, fitness goals,
                  medical conditions (optional).
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Usage Data:</h3>
                <p>
                  Device information, app activity, cookies (if applicable).
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To generate personalized diet & nutrition plans using AI.</li>
              <li>To improve app performance and user experience.</li>
              <li>
                To send important updates or notifications (only with your
                consent).
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Data Sharing</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We do not sell your personal information.</li>
              <li>
                We may share anonymized, aggregated data for research or product
                improvement.
              </li>
              <li>
                Data may be shared with trusted third-party service providers
                (e.g., hosting, analytics).
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p>
              We use encryption and industry-standard measures to protect your
              information. However, no system is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access, correct, or delete your data at any time.</li>
              <li>Withdraw consent for data processing.</li>
              <li>Request data export (where applicable under GDPR/CCPA).</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
            <p>
              We retain data only as long as necessary for providing our
              services or as required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              7. Cookies and Tracking
            </h2>
            <p>
              We may use cookies and similar technologies to enhance your
              experience and analyze app usage. You can manage cookie
              preferences through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              8. Third-Party Services
            </h2>
            <p>
              Our app may integrate with third-party services for
              authentication, analytics, or other functionality. These services
              have their own privacy policies that govern how they handle your
              data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              9. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Users will be
              notified of significant changes through the app or email.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or how we
              handle your data, please contact us through the app or visit our
              support page.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

export const metadata = {
  title: "Privacy Policy - WellNourish AI",
  description:
    "Privacy Policy for WellNourish AI - Learn how we collect, use, and protect your personal data while using our AI-powered diet and workout planning platform.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy - WellNourish AI",
    description:
      "Privacy Policy for WellNourish AI - Learn how we collect, use, and protect your personal data.",
    url: "/privacy",
    type: "website",
  },
};
