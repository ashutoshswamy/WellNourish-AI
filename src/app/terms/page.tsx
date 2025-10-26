export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          📜 Terms of Service
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Last Updated: October 26, 2025
        </p>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-6">
            Welcome to WellNourish AI ("the App"). By using our services, you
            agree to these Terms of Service. Please read them carefully.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Eligibility
            </h2>
            <p className="text-gray-700">
              You must be at least 18 years old or have parental/guardian
              consent to use this App.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Services Provided
            </h2>
            <p className="text-gray-700">
              The App uses Generative AI to create personalized diet and
              nutrition plans based on the information you provide (e.g., health
              goals, dietary preferences, allergies). The results are
              recommendations only and do not replace professional medical
              advice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. User Responsibilities
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide accurate and up-to-date health information.</li>
              <li>Use the App only for personal, non-commercial purposes.</li>
              <li>
                Do not misuse the App, upload harmful content, or attempt
                unauthorized access.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. No Medical Advice
            </h2>
            <p className="text-gray-700">
              The App provides generalized health and nutrition recommendations.
              It is not a substitute for professional medical advice, diagnosis,
              or treatment. Always consult a qualified healthcare provider
              before making major dietary or lifestyle changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Intellectual Property
            </h2>
            <p className="text-gray-700">
              All content, algorithms, and design elements of the App are owned
              by WellNourish AI. Users may not reproduce, modify, or distribute
              content without permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-gray-700">
              We are not responsible for any adverse effects, health issues, or
              damages arising from the use of this App. Use at your own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Termination
            </h2>
            <p className="text-gray-700">
              We may suspend or terminate accounts if users violate these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Governing Law
            </h2>
            <p className="text-gray-700">
              These Terms are governed by the laws of the United States.
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
