"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { updatePassword } from "./actions";
import { Loader2, Eye, EyeOff, Leaf } from "lucide-react";

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
      <div className="hidden lg:flex relative bg-[hsl(130,20%,28%)] justify-center items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(130,18%,42%)]/20 to-transparent"></div>
        <div className="relative z-10 p-12 text-white max-w-md">
          <div className="mb-6 p-3 rounded-xl bg-white/10 w-fit">
            <Leaf className="h-8 w-8 text-white/80" />
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">Secure your<br />account.</h1>
          <p className="text-white/60 text-lg leading-relaxed">
            Choose a strong password to protect your health data.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col justify-center items-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Reset Password
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your new password below
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/40 focus:border-primary/40 focus:outline-none transition-all pr-10 text-sm"
                    placeholder="••••••••"
                  />
                   <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

               <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={6}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/40 focus:border-primary/40 focus:outline-none transition-all pr-10 text-sm"
                    placeholder="••••••••"
                  />
                   <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground outline-none"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/15 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
