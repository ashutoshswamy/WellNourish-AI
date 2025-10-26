export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🔒 Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Last Updated: October 26, 2025
        </p>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-6">
            Your privacy is important to us. This Privacy Policy explains how
            WellNourish AI collects, uses, and protects your data.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Information We Collect
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Personal Data:</strong> Name, age, gender, contact
                details (if provided).
              </li>
              <li>
                <strong>Health Data:</strong> Dietary preferences, allergies,
                weight, height, fitness goals, medical conditions (optional).
              </li>
              <li>
                <strong>Usage Data:</strong> Device information, app activity,
                cookies (if applicable).
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>To generate personalized diet & nutrition plans using AI.</li>
              <li>To improve app performance and user experience.</li>
              <li>
                To send important updates or notifications (only with your
                consent).
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Data Sharing
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Data Security
            </h2>
            <p className="text-gray-700">
              We use encryption and industry-standard measures to protect your
              information. However, no system is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Your Rights
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Access, correct, or delete your data at any time.</li>
              <li>Withdraw consent for data processing.</li>
              <li>Request data export (where applicable under GDPR/CCPA).</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Retention
            </h2>
            <p className="text-gray-700">
              We retain data only as long as necessary for providing our
              services or as required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Changes to Policy
            </h2>
            <p className="text-gray-700">
              We may update this Privacy Policy. Users will be notified of
              significant changes.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
