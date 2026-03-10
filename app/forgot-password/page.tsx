"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { resetPassword } from "./actions";
import { Loader2, Mail, ArrowLeft, Leaf } from "lucide-react";
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
      <div className="hidden lg:flex relative bg-[hsl(130,20%,28%)] justify-center items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(130,18%,42%)]/20 to-transparent"></div>
        <div className="relative z-10 p-12 text-white max-w-md">
          <div className="mb-6 p-3 rounded-xl bg-white/10 w-fit">
            <Leaf className="h-8 w-8 text-white/80" />
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">Recover your<br />account.</h1>
          <p className="text-white/60 text-lg leading-relaxed">
            Get back to your personalized health journey in no time.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col justify-center items-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-6">
            <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
            </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Forgot Password?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter email associated with your account
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {success ? (
              <div className="text-center space-y-4">
                <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Check your email</h3>
                <p className="text-muted-foreground text-sm">
                   {success}
                </p>
                <div className="pt-4">
                     <Link href="/login">
                        <Button className="w-full">
                            Back to Login
                        </Button>
                     </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/40 focus:border-primary/40 focus:outline-none transition-all text-sm"
                    placeholder="hello@example.com"
                  />
                </div>

                {error && (
                  <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/15 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
