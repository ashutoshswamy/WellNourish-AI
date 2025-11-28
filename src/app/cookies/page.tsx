'use client';

import Link from 'next/link';
import { BreadcrumbSchema, WebPageSchema } from '@/components/JsonLd';
import { SITE_URL } from '@/lib/seo.config';

export default function CookiePolicyPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Cookie Policy', url: `${SITE_URL}/cookies` },
        ]}
      />
      <WebPageSchema
        name="Cookie Policy - WellNourish AI"
        description="Understand how WellNourish AI uses cookies to improve your experience."
        url={`${SITE_URL}/cookies`}
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
            🍪 Cookie Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Last Updated: November 29, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 sm:p-12 space-y-8">
          <p className="text-gray-600 dark:text-gray-300">
            WellNourish AI (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) uses cookies and similar tracking technologies to improve your experience, analyze usage, and provide personalized content.
            This Cookie Policy explains how and why we use cookies in accordance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and <strong>Information Technology Act, 2000</strong>.
          </p>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">1. What Are Cookies?</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and activity.
            </p>
            <p className="text-gray-600 dark:text-gray-300">We may also use:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Local storage</li>
              <li>Session storage</li>
              <li>Web beacons / pixels</li>
              <li>Analytics scripts</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              All are treated as &quot;cookies&quot; in this policy.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">2. Types of Cookies We Use</h2>
            
            {/* 2.1 Essential Cookies */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">2.1 Essential Cookies (Required)</h3>
              <p className="text-gray-600 dark:text-gray-300">These cookies are necessary for:</p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                <li>Logging in</li>
                <li>Security & authentication</li>
                <li>Preventing fraud</li>
                <li>Basic site operation</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300">Without these, the website cannot function.</p>
              <p className="text-gray-600 dark:text-gray-300"><strong>Examples:</strong></p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                <li>Supabase authentication cookies</li>
                <li>Session identifiers</li>
                <li>CSRF protection cookies</li>
              </ul>
              <p className="text-green-600 dark:text-green-400 font-medium mt-2">
                ➡️ Consent Not Required under DPDP Act because they are essential.
              </p>
            </div>

            {/* 2.2 Preference Cookies */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">2.2 Preference Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300">Used to store:</p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                <li>Theme settings</li>
                <li>Previously entered onboarding preferences</li>
                <li>Language choices</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300">These make your experience more personalized.</p>
              <p className="text-amber-600 dark:text-amber-400 font-medium mt-2">
                ➡️ Consent Required (we ask through a cookie banner if implemented).
              </p>
            </div>

            {/* 2.3 Analytics Cookies */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">2.3 Analytics Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300">We use analytics tools to understand:</p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                <li>How users interact with the app</li>
                <li>Which pages perform well</li>
                <li>Errors and performance issues</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300"><strong>Possible analytics providers:</strong></p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                <li>Vercel analytics</li>
                <li>Supabase edge logs</li>
                <li>Other privacy-friendly tools</li>
              </ul>
              <p className="text-amber-600 dark:text-amber-400 font-medium mt-2">
                ➡️ Consent Required, unless anonymized.
              </p>
            </div>

            {/* 2.4 AI Personalization Cookies */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">2.4 AI Personalization Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300">Used to:</p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                <li>Save plan generation history</li>
                <li>Improve recommendations</li>
                <li>Speed up repeated requests</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300">
                These are stored securely, usually in local storage or Supabase session.
              </p>
              <p className="text-amber-600 dark:text-amber-400 font-medium mt-2">
                ➡️ Consent Required.
              </p>
            </div>

            {/* 2.5 Third-Party Cookies */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">2.5 Third-Party Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300">Used only for:</p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                <li>Google OAuth login</li>
                <li>GitHub OAuth login</li>
                <li>AI interactions with third-party models (without storing personal identifiers)</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                These providers have their own cookie policies.
              </p>
              <p className="text-blue-600 dark:text-blue-400 font-medium mt-2">
                ➡️ When you sign in using these providers, you consent to their cookie policies.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">3. Why We Use Cookies</h2>
            <p className="text-gray-600 dark:text-gray-300">We use cookies to:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Keep you logged in</li>
              <li>Provide personalized content</li>
              <li>Improve performance</li>
              <li>Enhance user experience</li>
              <li>Ensure security</li>
              <li>Analyze usage and fix bugs</li>
            </ul>
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-green-800 dark:text-green-300 font-medium">
                We do NOT use cookies for:
              </p>
              <ul className="list-disc list-inside text-green-700 dark:text-green-400 space-y-1 ml-4 mt-2">
                <li>Advertising</li>
                <li>Retargeting</li>
                <li>Selling data</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">4. Managing or Disabling Cookies</h2>
            <p className="text-gray-600 dark:text-gray-300">You can control cookies through:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Browser settings</li>
              <li>Clearing cookies/cache</li>
              <li>Using privacy modes</li>
              <li>Blocking non-essential cookies</li>
            </ul>
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-amber-800 dark:text-amber-300 font-medium">
                ⚠️ Disabling essential cookies may prevent you from using core features like:
              </p>
              <ul className="list-disc list-inside text-amber-700 dark:text-amber-400 space-y-1 ml-4 mt-2">
                <li>Logging in</li>
                <li>Saving preferences</li>
                <li>Viewing your generated plans</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">5. Data Protection & Consent</h2>
            <p className="text-gray-600 dark:text-gray-300">We comply with:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li><strong>DPDP Act, 2023</strong></li>
              <li><strong>IT Act, 2000</strong></li>
              <li><strong>SPDI Rules, 2011</strong></li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Consent is required for all <strong>non-essential</strong> cookies.
              You may withdraw consent anytime by clearing cookies or contacting us.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">6. Updates to This Policy</h2>
            <p className="text-gray-600 dark:text-gray-300">We may revise this Cookie Policy to:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
              <li>Comply with new laws</li>
              <li>Update technology changes</li>
              <li>Improve transparency</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Continued use of the Service implies acceptance of the updated policy.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">7. Contact & Grievance Officer</h2>
            <p className="text-gray-600 dark:text-gray-300">
              For questions or concerns, contact:
            </p>
            <div className="mt-4 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-800 dark:text-gray-200 font-medium mb-2">Grievance Officer:</p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li><strong>Name:</strong> Ashutosh Swamy</li>
                <li>
                  <strong>Email:</strong>{' '}
                  <a 
                    href="mailto:ashutoshswamy397@gmail.com" 
                    className="text-green-600 dark:text-green-400 hover:underline"
                  >
                    ashutoshswamy397@gmail.com
                  </a>
                </li>
                <li><strong>Address:</strong> Pune, Maharashtra, India</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm">
                We will respond within <strong>15 working days</strong> as required by Indian law.
              </p>
            </div>
          </section>

          {/* Related Links */}
          <section className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Related Policies</h3>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/privacy"
                className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} WellNourish AI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
