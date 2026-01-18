"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { AnimatedSection } from "@/components/ui/animated-section"
import { Lock } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black selection:bg-emerald-500/30 selection:text-emerald-500">
      <Navbar />
      
      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
         {/* Background Gradients */}
         <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50/80 via-white to-white dark:from-emerald-950/30 dark:via-black dark:to-black opacity-100"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="mb-12 text-center">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-6">
                <Lock className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">Privacy Policy</h1>
              <p className="text-lg text-slate-500 font-medium">Last Updated: January 18, 2026</p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 shadow-xl border border-slate-200/60 dark:border-slate-800">
              <div className="prose prose-lg prose-slate dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white
                prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
                prose-li:marker:text-emerald-500">
                
                <h3>1. Introduction</h3>
                <p>Welcome to WellNourish AI. We respect your privacy and are committed to protecting your personal data, especially your sensitive health information. This privacy policy informs you how we handle your data when you use our AI-powered health planning application.</p>
                <p>We use &quot;cookies&quot; to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>

                <h3>2. Data We Collect</h3>
                <p>We collect specific personal and health data necessary to generate your plans:</p>
                <ul>
                  <li><strong>Identity Data:</strong> Name, email address, and authentication credentials (via Google or GitHub User IDs).</li>
                  <li><strong>Health & Physical Data:</strong> Age, gender, height, weight, activity level.</li>
                  <li><strong>Medical & Preference Data:</strong> Specific medical conditions, allergies, dietary preferences (e.g., Vegan, Keto), and diverse cuisine preferences.</li>
                  <li><strong>Usage Data:</strong> Information on how you interact with the generated plans.</li>
                </ul>

                <h3>3. How We Use Your Data</h3>
                <p>We use your data solely for the following purposes:</p>
                <ul>
                  <li><strong>AI Plan Generation:</strong> Your health data (excluding personally identifiable markers where possible) is processed by our AI provider (Google Gemini) to generate personalized diet and workout schedules.</li>
                  <li><strong>Account Management:</strong> To maintain your user profile and save your generated plans in our database.</li>
                  <li><strong>Service Improvement:</strong> To understand usage patterns and improve the quality of AI prompts.</li>
                </ul>

                <h3>4. Data Sharing and Third Parties</h3>
                <p>We do not sell your personal data. We share data only with necessary service providers:</p>
                <ul>
                  <li><strong>Supabase:</strong> We use Supabase for secure database hosting and authentication services. Your data is stored securely on their servers.</li>
                  <li><strong>Google Gemini (AI Provider):</strong> To generate your plans, your anonymized health parameters (e.g., &quot;30 year old male, vegan, allergic to peanuts&quot;) are sent to the Gemini API.</li>
                  <li><strong>Analytics:</strong> We may use anonymous analytics tools to monitor app stability.</li>
                </ul>

                <h3>5. Data Security</h3>
                <p>We implement robust security measures to protect your health data.</p>
                <ul>
                  <li><strong>Encryption:</strong> Data is encrypted in transit and at rest where applicable via our providers (Supabase).</li>
                  <li><strong>Access Control:</strong> Only you can access your private health profile and generated plans through your authenticated account.</li>
                </ul>

                <h3>6. Your Rights</h3>
                <p>You have the right to:</p>
                <ul>
                  <li>Access the personal data we hold about you.</li>
                  <li>Request correction of accurate data (e.g., updating your weight or allergies).</li>
                  <li>Request deletion of your account and all associated data.</li>
                </ul>

                <h3>7. Changes to This Privacy Policy</h3>
                <p>We may update our Privacy Policy. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

                <h3>8. Contact Us</h3>
                <p>If you have any questions about this Privacy Policy, please contact us.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </main>

      <Footer />
    </div>
  )
}
