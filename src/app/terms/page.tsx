'use client';

import Link from 'next/link';
import { BreadcrumbSchema, WebPageSchema } from '@/components/JsonLd';
import { SITE_URL } from '@/lib/seo.config';

export default function TermsOfServicePage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Terms of Service', url: `${SITE_URL}/terms` },
        ]}
      />
      <WebPageSchema
        name="Terms of Service - WellNourish AI"
        description="Read the terms and conditions for using WellNourish AI."
        url={`${SITE_URL}/terms`}
      />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 mb-6"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Last Updated: November 29, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 sm:p-12 space-y-8">
          <p className="text-gray-600 dark:text-gray-300">
            Welcome to <strong>WellNourish AI</strong> (&quot;we&quot;, &quot;our&quot;, &quot;the Service&quot;).
            By accessing or using <strong>wellnourishai.in</strong> or the WellNourish AI mobile/desktop application, you agree to these Terms of Service.
          </p>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">1. Eligibility</h2>
            <p className="text-gray-600 dark:text-gray-300">To use WellNourish AI, you must:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Be at least <strong>18 years old</strong>, OR</li>
              <li>Be <strong>16–17 years old with parental/guardian consent</strong></li>
              <li>Provide accurate information</li>
              <li>Comply with Indian laws, including the <strong>DPDP Act, 2023</strong> and <strong>IT Act, 2000</strong></li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">2. About the Service</h2>
            <p className="text-gray-600 dark:text-gray-300">WellNourish AI provides:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>AI-generated personalized diet plans</li>
              <li>AI-generated workout plans</li>
              <li>Lifestyle and wellness recommendations</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300">
              The Service is intended for <strong>informational and educational</strong> purposes only.
            </p>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">⚠️ Not Medical Advice</h3>
              <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                The recommendations are NOT created by licensed medical or dietetic professionals, should NOT replace professional medical consultation, and should NOT be used to diagnose, treat, or cure any condition. Consult a certified doctor before making major changes to your health routine. You are fully responsible for how you use the generated plans.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">3. Account Registration</h2>
            <p className="text-gray-600 dark:text-gray-300">You may sign up using:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Google OAuth</li>
              <li>GitHub OAuth</li>
              <li>Email/password (via Supabase)</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">You agree to:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Keep your login credentials secure</li>
              <li>Not share your account</li>
              <li>Notify us of unauthorized access</li>
              <li>Provide accurate age and personal details</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              We may suspend or terminate accounts for violations or irregular activity.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">4. Acceptable Use</h2>
            <p className="text-gray-600 dark:text-gray-300">You agree to NOT:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Interfere with the app&apos;s operation</li>
              <li>Attempt to hack, reverse engineer, or disrupt systems</li>
              <li>Upload harmful, abusive, or illegal content</li>
              <li>Use the platform for any unlawful activities under Indian law</li>
              <li>Misrepresent your identity or health status</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">5. AI-Generated Content</h2>
            <p className="text-gray-600 dark:text-gray-300">You understand and agree that:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>AI results may contain errors</li>
              <li>Output may vary depending on the model</li>
              <li>Generated plans may not always suit your exact needs</li>
              <li>You assume responsibility for acting on the recommendations</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              WellNourish AI does <strong>not</strong> guarantee accuracy or completeness of AI output.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">6. Intellectual Property</h2>
            <p className="text-gray-600 dark:text-gray-300">We own:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Branding</li>
              <li>Software</li>
              <li>UI/UX</li>
              <li>AI prompt structures</li>
              <li>Design assets</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">You own:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>The personal data you enter</li>
              <li>Your preferences and profile information</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">7. Payments (If Premium Features Are Added)</h2>
            <p className="text-gray-600 dark:text-gray-300">If subscriptions or one-time purchases become available:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Pricing will be disclosed clearly</li>
              <li>Payments will follow Indian consumer protection rules</li>
              <li>Refunds will be limited unless required by law</li>
              <li>Subscriptions may renew automatically until cancelled</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">8. Limitation of Liability</h2>
            <p className="text-gray-600 dark:text-gray-300">To the maximum extent permitted by Indian law:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>We are <strong>not liable</strong> for indirect, incidental, or consequential damages</li>
              <li>We are <strong>not liable</strong> for health issues, injuries, or losses resulting from use of the Service</li>
              <li>Our total liability is limited to the amount you paid to us in the past 12 months (if any)</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">9. Termination</h2>
            <p className="text-gray-600 dark:text-gray-300">We may terminate or suspend your account if:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>You violate these Terms</li>
              <li>You misuse the Service</li>
              <li>A lawful authority instructs us</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              You may delete your account anytime.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">10. Governing Law & Dispute Resolution</h2>
            <p className="text-gray-600 dark:text-gray-300">
              These Terms are governed by the laws of <strong>India</strong>.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Legal jurisdiction: <strong>Courts of Pune, Maharashtra, India</strong>
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">11. Contact & Grievance Redressal</h2>
            <p className="text-gray-600 dark:text-gray-300">(DPDP Act, Mandatory)</p>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mt-2">
              <p className="text-gray-600 dark:text-gray-300"><strong>Grievance Officer:</strong> Ashutosh Swamy</p>
              <p className="text-gray-600 dark:text-gray-300">
                <strong>Email:</strong>{' '}
                <a href="mailto:ashutoshswamy397@gmail.com" className="text-green-600 dark:text-green-400 hover:underline">
                  ashutoshswamy397@gmail.com
                </a>
              </p>
              <p className="text-gray-600 dark:text-gray-300"><strong>Address:</strong> Pune, Maharashtra, India</p>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              We will respond to grievances within <strong>15 working days</strong>, as required under Indian law.
            </p>
          </section>

          {/* Footer Links */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Also see our{' '}
              <Link href="/privacy" className="text-green-600 dark:text-green-400 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
