"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign In - WellNourish AI</title>
        <meta
          name="description"
          content="Sign in to your WellNourish AI account to access your personalized diet and workout plans."
        />
        <meta name="robots" content="noindex, follow" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30 flex items-center justify-center p-3 xs:p-4 safe-area-top safe-area-bottom">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur mx-auto">
          <CardHeader className="text-center pb-6 xs:pb-8 px-4 xs:px-6 pt-6 xs:pt-8">
            <CardTitle className="text-2xl xs:text-3xl md:text-3xl font-bold font-sans bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-sm xs:text-base text-muted-foreground mt-2">
              Sign in to your WellNourish AI account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 xs:space-y-6 px-4 xs:px-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2 xs:space-y-3">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 h-12 xs:h-14 border-2 focus:border-primary transition-colors text-base focus-ring a11y-focus"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 xs:space-y-3">
                <Label htmlFor="password" className="text-sm font-semibold">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-12 h-12 xs:h-14 border-2 focus:border-primary transition-colors text-base focus-ring a11y-focus"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 xs:h-5 xs:w-5" />
                    ) : (
                      <Eye className="h-4 w-4 xs:h-5 xs:w-5" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 xs:space-y-6 pt-4 xs:pt-6 px-4 xs:px-6 pb-6 xs:pb-8">
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 xs:h-14 text-sm xs:text-base font-semibold bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90 transition-all duration-200 shadow-lg hover:shadow-xl touch-target-large a11y-focus"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 xs:h-5 xs:w-5 animate-spin" />
                    <span className="hidden xs:inline">Signing In...</span>
                    <span className="xs:hidden">Signing In...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="text-center text-xs xs:text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-primary hover:text-primary/90 transition-colors underline-offset-4 hover:underline touch-target a11y-focus"
                >
                  Sign up here
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
