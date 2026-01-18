"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { AnimatedSection } from "@/components/ui/animated-section"
import { Cookie } from "lucide-react"

export default function CookiesPage() {
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
                <Cookie className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">Cookies Policy</h1>
              <p className="text-lg text-slate-500 font-medium">Last Updated: January 18, 2026</p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 shadow-xl border border-slate-200/60 dark:border-slate-800">
              <div className="prose prose-lg prose-slate dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white
                prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
                prose-li:marker:text-emerald-500">
                
                <h3>1. What Are Cookies?</h3>
                <p>Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.</p>

                <h3>2. How We Use Cookies</h3>
                <p>WellNourish AI uses cookies to securely identify you and keep you signed in. We use the following types of cookies:</p>
                
                <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Essential Cookies</h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-start"><span className="mr-2 text-emerald-500">•</span>Authentication & Login Sessions</li>
                      <li className="flex items-start"><span className="mr-2 text-emerald-500">•</span>Security & CSRF Protection</li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">AI Functionality</h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                       <li className="flex items-start"><span className="mr-2 text-emerald-500">•</span>Session state for Plan Generation</li>
                       <li className="flex items-start"><span className="mr-2 text-emerald-500">•</span>User preference caching</li>
                    </ul>
                  </div>
                </div>

                <h3>3. Third-Party Cookies</h3>
                <ul>
                  <li><strong>Supabase:</strong> Uses cookies to manage your authentication session securely.</li>
                  <li><strong>Google:</strong> If you sign in via Google OAuth, Google may set cookies to authenticate your identity.</li>
                </ul>

                <h3>4. Managing Cookies</h3>
                <p>Most web browsers allow some control of most cookies through the browser settings. However, if you disable cookies, you will not be able to log in or use the core AI plan generation features of WellNourish AI.</p>

                <h3>5. Changes to This Policy</h3>
                <p>We may update this Cookies Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

                <h3>6. Contact Us</h3>
                <p>If you have any questions about this Cookies Policy, please contact us.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </main>

      <Footer />
    </div>
  )
}
