"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState } from "react"
import { login } from "./actions"
import { Loader2, Eye, EyeOff, Leaf } from "lucide-react"
import { Icons } from "@/components/ui/icons"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleOAuth = async (provider: "google" | "github") => {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    })

    if (error) {
       setError(error.message)
       setLoading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(event.currentTarget)
    
    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex relative bg-[hsl(130,20%,28%)] justify-center items-center overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-[hsl(130,18%,42%)]/20 to-transparent"></div>
         <div className="relative z-10 p-12 text-white max-w-md">
            <div className="mb-6 p-3 rounded-xl bg-white/10 w-fit">
               <Leaf className="h-8 w-8 text-white/80" />
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">Eat wiser. <br/>Move better.</h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Join thousands of users transforming their lives with AI-personalized health plans.
            </p>
         </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col justify-center items-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your email to sign in
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
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
              
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <Link 
                    href="/forgot-password"
                    className="text-xs font-medium text-primary hover:text-primary/80"
                  >
                    Forgot password?
                  </Link>
                </div>
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

              {error && (
                <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/15 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleOAuth("google")}
                  disabled={loading}
                >
                  <Icons.google className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleOAuth("github")}
                  disabled={loading}
                >
                  <Icons.github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/signup"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Don&apos;t have an account? <span className="font-medium text-primary">Sign up</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
