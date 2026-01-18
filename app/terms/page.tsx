"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { AnimatedSection } from "@/components/ui/animated-section"
import { ShieldCheck } from "lucide-react"

export default function TermsPage() {
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
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">Terms of Service</h1>
              <p className="text-lg text-slate-500 font-medium">Last Updated: January 18, 2026</p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 shadow-xl border border-slate-200/60 dark:border-slate-800">
              <div className="prose prose-lg prose-slate dark:prose-invert max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white
                prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
                prose-li:marker:text-emerald-500">
                
                <h3>1. Acceptance of Terms</h3>
                <p>By accessing or using the WellNourish AI application (the &quot;Service&quot;), you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>

                <div className="bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-500 p-6 rounded-r-xl my-8">
                  <h3 className="mt-0 text-emerald-800 dark:text-emerald-400">2. Medical Disclaimer (CRITICAL)</h3>
                  <p className="mb-4">WellNourish AI is an artificial intelligence-powered tool designed to provide general health, diet, and workout suggestions.</p>
                  <ul className="mb-0">
                    <li><strong>NO MEDICAL ADVICE:</strong> The Service is for informational purposes only. It is NOT intended to be a substitute for professional medical advice, diagnosis, or treatment.</li>
                    <li><strong>CONSULT YOUR DOCTOR:</strong> Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition, diet change, or exercise program.</li>
                    <li><strong>RISK:</strong> You agree that your use of the Service is at your own risk. Exercise and dietary changes carry inherent risks. WellNourish AI is not responsible for any injuries or health complications that may result from following the AI-generated plans.</li>
                  </ul>
                </div>

                <h3>3. Artificial Intelligence Disclaimer</h3>
                <ul>
                  <li><strong>GENERATIVE AI:</strong> This Service utilizes advanced Generative AI (specifically Google&apos;s Gemini API) to create plans. AI can hallucinate or make errors.</li>
                  <li><strong>ACCURACY:</strong> While we strive for accuracy, specific medical interactions (e.g., allergies vs. ingredients) may possibly be misidentified by the AI. You must verify all recommendations before consumption or practice.</li>
                  <li><strong>NO GUARANTEE:</strong> We make no guarantees that the plans generated will achieve your specific health goals.</li>
                </ul>

                <h3>4. User Responsibilities</h3>
                <ul>
                  <li><strong>ACCURATE DATA:</strong> You agree to provide accurate, current, and complete information regarding your health, medical conditions, and allergies. Providing false information may lead to dangerous recommendations.</li>
                  <li><strong>SAFETY:</strong> You agree not to use this Service if you have a history of severe eating disorders or critical medical conditions unless under strict supervision of a medical professional.</li>
                </ul>

                <h3>5. Account Security</h3>
                <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</p>

                <h3>6. Termination</h3>
                <p>We reserve the right to withdraw or amend our Service, and any service or material we provide on the Service, in our sole discretion without notice. We will not be liable if for any reason all or any part of the Service is unavailable at any time or for any period. From time to time, we may restrict access to some parts of the Service, or the entire Service, to users, including registered users.</p>

                <h3>7. Limitation of Liability</h3>
                <p>In no event shall WellNourish AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

                <h3>8. Changes</h3>
                <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time.</p>

                <h3>9. Contact Us</h3>
                <p>If you have any questions about these Terms, please contact us.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </main>

      <Footer />
    </div>
  )
}
