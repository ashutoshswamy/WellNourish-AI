"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { resetPassword } from "./actions";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);

    const result = await resetPassword(formData);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(result.success);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex relative bg-emerald-900 justify-center items-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop')] bg-cover bg-center opacity-50 mix-blend-overlay"></div>
        <div className="relative z-10 p-12 text-white max-w-lg">
          <h1 className="text-5xl font-bold mb-6">Recover your<br />account.</h1>
          <p className="text-emerald-100 text-xl">
            Get back to your personalized health journey in no time.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col justify-center items-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
            <Link href="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
            </Link>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Forgot Password?
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Enter email associated with your account
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-slate-950 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800"
          >
            {success ? (
              <div className="text-center space-y-4">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Check your email</h3>
                <p className="text-gray-600 dark:text-gray-400">
                   {success}
                </p>
                <div className="pt-4">
                     <Link href="/login">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                            Back to Login
                        </Button>
                     </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                    placeholder="hello@example.com"
                  />
                </div>

                {error && (
                  <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full py-6 text-lg rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  Send Reset Link
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
