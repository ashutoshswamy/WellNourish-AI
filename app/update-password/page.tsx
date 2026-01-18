"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { updatePassword } from "./actions";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function UpdatePasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(event.currentTarget);
    
    // Client-side validation
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
    }

    const result = await updatePassword(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex relative bg-emerald-900 justify-center items-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop')] bg-cover bg-center opacity-50 mix-blend-overlay"></div>
        <div className="relative z-10 p-12 text-white max-w-lg">
          <h1 className="text-5xl font-bold mb-6">Secure your<br />account.</h1>
          <p className="text-emerald-100 text-xl">
            Choose a strong password to protect your health data.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col justify-center items-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Reset Password
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Enter your new password below
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-slate-950 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all pr-10"
                    placeholder="••••••••"
                  />
                   <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

               <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all pr-10"
                    placeholder="••••••••"
                  />
                   <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 outline-none"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full py-6 text-lg rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Update Password
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
