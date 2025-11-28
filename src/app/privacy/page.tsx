'use client';

import Link from 'next/link';
import { BreadcrumbSchema, WebPageSchema } from '@/components/JsonLd';
import { SITE_URL } from '@/lib/seo.config';

export default function PrivacyPolicyPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Privacy Policy', url: `${SITE_URL}/privacy` },
        ]}
      />
      <WebPageSchema
        name="Privacy Policy - WellNourish AI"
        description="Learn how WellNourish AI collects, uses, and protects your personal data."
        url={`${SITE_URL}/privacy`}
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
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Last Updated: November 29, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 sm:p-12 space-y-8">
          <p className="text-gray-600 dark:text-gray-300">
            WellNourish AI (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) respects your privacy.
            This Privacy Policy explains how we collect, use, store, and protect your personal data in compliance with:
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
            <li><strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong></li>
            <li><strong>Information Technology Act, 2000</strong></li>
            <li><strong>SPDI Rules, 2011</strong></li>
          </ul>
          <p className="text-gray-600 dark:text-gray-300">
            By using WellNourish AI, you consent to this Privacy Policy.
          </p>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">1. Data We Collect</h2>
            
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">1.1 Personal Information</h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Name</li>
              <li>Email address</li>
              <li>Profile photo (from Google/GitHub OAuth if provided)</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-4">1.2 Wellness / Sensitive Data</h3>
            <p className="text-gray-600 dark:text-gray-300">You voluntarily provide:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Age</li>
              <li>Height</li>
              <li>Weight</li>
              <li>Gender</li>
              <li>Dietary preferences</li>
              <li>Allergies</li>
              <li>Activity level</li>
              <li>Fitness goals</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              This may be considered <strong>Sensitive Personal Data</strong> under Indian law.
            </p>

            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-4">1.3 Technical Information</h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>IP address</li>
              <li>Device and browser information</li>
              <li>Usage analytics</li>
              <li>Error logs</li>
              <li>Login timestamps</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">2. How We Use Your Data</h2>
            <p className="text-gray-600 dark:text-gray-300">We use your data for:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Generating AI-based diet and fitness plans</li>
              <li>Improving recommendations</li>
              <li>Account authentication & security</li>
              <li>Analytics and performance</li>
              <li>Preventing fraud or misuse</li>
              <li>Compliance with Indian legal requirements</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4 font-semibold">
              We do not sell your data.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">3. AI Data Processing</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We share only necessary data (e.g., age, weight, goals) with <strong>Google Gemini</strong> to generate personalized plans.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-4">We do <strong>not</strong> share:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Your email</li>
              <li>Authentication tokens</li>
              <li>Financial information</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              AI processing is used <strong>strictly</strong> for providing services requested by you.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">4. Legal Basis for Processing (DPDP Act)</h2>
            <p className="text-gray-600 dark:text-gray-300">We process your data based on:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li><strong>Your consent</strong></li>
              <li><strong>Contractual necessity</strong> (to provide our service)</li>
              <li><strong>Legitimate interests</strong> (security, fraud prevention)</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              You may withdraw consent at any time.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">5. Data Storage & Security</h2>
            <p className="text-gray-600 dark:text-gray-300">Your data is stored securely using:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Supabase PostgreSQL</li>
              <li>TLS encryption in transit</li>
              <li>Access controls</li>
              <li>Industry-standard security measures</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">We comply with:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li><strong>IT Act Section 43A</strong></li>
              <li><strong>SPDI Rules reasonable security practices</strong></li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              No system is completely secure, but we take all reasonable precautions.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">6. Data Retention</h2>
            <p className="text-gray-600 dark:text-gray-300">We retain your data until:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Your account is active</li>
              <li>You request deletion</li>
              <li>Legal obligations require retention</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">If you delete your account:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Personal data is removed within <strong>30 days</strong></li>
              <li>Backups/logs may be retained as required by law</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">7. Your Rights Under Indian Law</h2>
            <p className="text-gray-600 dark:text-gray-300">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Access your data</li>
              <li>Correct data</li>
              <li>Delete your data</li>
              <li>Withdraw consent</li>
              <li>Request an export of your data</li>
              <li>File grievances with our Grievance Officer</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              We will respond within <strong>15 working days</strong>.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">8. Children&apos;s Privacy</h2>
            <p className="text-gray-600 dark:text-gray-300">
              The Service is <strong>not intended for children under 16</strong>.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              We do not knowingly collect personal data from minors.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">9. Data Sharing</h2>
            <p className="text-gray-600 dark:text-gray-300">We may share data only with:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Supabase (database + auth)</li>
              <li>Google Gemini (AI model)</li>
              <li>Google / GitHub (OAuth providers)</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              We do <strong>not</strong> share data with advertisers or data brokers.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">10. International Data Transfer</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Your data may be processed outside India (e.g., Supabase servers, Google AI infrastructure).
              By using the Service, you consent to cross-border data transfers permitted under the DPDP Act.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">11. Changes to This Policy</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We may update this Privacy Policy periodically.
              Continued use of the app after updates constitutes acceptance.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">12. Grievance Redressal</h2>
            <p className="text-gray-600 dark:text-gray-300">(DPDP Act Requirement)</p>
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
              We will respond to complaints within <strong>15 working days</strong>.
            </p>
          </section>

          {/* Footer Links */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Also see our{' '}
              <Link href="/terms" className="text-green-600 dark:text-green-400 hover:underline">
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
