import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Terms of Service
          </CardTitle>
          <p className="text-center text-muted-foreground">WellNourish AI</p>
          <p className="text-center text-sm text-muted-foreground">
            Last Updated: October 1, 2025
          </p>
        </CardHeader>
        <CardContent className="prose prose-slate max-w-none">
          <p className="text-lg mb-6">
            Welcome to WellNourish AI ("the App"). By using our services, you
            agree to these Terms of Service. Please read them carefully.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Eligibility</h2>
            <p>
              You must be at least 18 years old or have parental/guardian
              consent to use this App.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              2. Services Provided
            </h2>
            <p>
              The App uses Generative AI to create personalized diet and
              nutrition plans based on the information you provide (e.g., health
              goals, dietary preferences, allergies). The results are
              recommendations only and do not replace professional medical
              advice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              3. User Responsibilities
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and up-to-date health information.</li>
              <li>Use the App only for personal, non-commercial purposes.</li>
              <li>
                Do not misuse the App, upload harmful content, or attempt
                unauthorized access.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              4. No Medical Advice
            </h2>
            <p>
              The App provides generalized health and nutrition recommendations.
              It is not a substitute for professional medical advice, diagnosis,
              or treatment. Always consult a qualified healthcare provider
              before making major dietary or lifestyle changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              5. Intellectual Property
            </h2>
            <p>
              All content, algorithms, and design elements of the App are owned
              by WellNourish AI. Users may not reproduce, modify, or distribute
              content without permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              6. Limitation of Liability
            </h2>
            <p>
              We are not responsible for any adverse effects, health issues, or
              damages arising from the use of this App. Use at your own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
            <p>
              We may suspend or terminate accounts if users violate these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
            <p>These Terms are governed by the laws of the United States.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              9. Contact Information
            </h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us through the app or visit our support page.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

export const metadata = {
  title: "Terms of Service - WellNourish AI",
  description:
    "Terms of Service for WellNourish AI - AI-powered personalized nutrition and diet planning app. Understand your rights and responsibilities when using our platform.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service - WellNourish AI",
    description:
      "Terms of Service for WellNourish AI - AI-powered personalized nutrition and diet planning app.",
    url: "/terms",
    type: "website",
  },
};
