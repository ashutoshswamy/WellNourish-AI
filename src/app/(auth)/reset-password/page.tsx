'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, AlertTriangle, Loader2, Shield, Check, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  useEffect(() => {
    const handlePasswordRecovery = async () => {
      // Check for error in URL params
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      if (errorParam) {
        setError(errorDescription || 'An error occurred');
        setIsValidSession(false);
        return;
      }

      // Check for code in URL (PKCE flow)
      const code = searchParams.get('code');
      
      if (code) {
        // Exchange the code for a session
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          console.error('Code exchange error:', exchangeError);
          setError(exchangeError.message);
          setIsValidSession(false);
          return;
        }
        
        // Remove code from URL after successful exchange
        window.history.replaceState({}, '', '/reset-password');
        setIsValidSession(true);
        return;
      }

      // Listen for auth state changes (handles hash fragment tokens)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setIsValidSession(true);
        } else if (event === 'SIGNED_IN' && session) {
          setIsValidSession(true);
        }
      });

      // Check if there's already a valid session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsValidSession(true);
      } else {
        // Give a moment for the hash fragment to be processed
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { data: { session: retrySession } } = await supabase.auth.getSession();
        if (retrySession) {
          setIsValidSession(true);
        } else {
          setIsValidSession(false);
        }
      }

      return () => {
        subscription.unsubscribe();
      };
    };

    handlePasswordRecovery();
  }, [supabase.auth, searchParams]);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 2000);
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-sm text-muted">
          Verifying your session...
        </p>
      </div>
    );
  }

  // No valid session
  if (!isValidSession) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-red-500/10"
        >
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </motion.div>
        <h2 className="mt-4 text-2xl font-bold">Invalid or expired link</h2>
        <p className="mt-2 text-sm text-muted">
          This password reset link is invalid or has expired.
          <br />
          Please request a new password reset link.
        </p>
        <motion.div 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="mt-6"
        >
          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center py-3 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
          >
            Request new link
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  // Success state
  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10"
        >
          <CheckCircle className="h-8 w-8 text-primary" />
        </motion.div>
        <h2 className="mt-4 text-2xl font-bold">Password updated!</h2>
        <p className="mt-2 text-sm text-muted">
          Your password has been successfully updated.
          <br />
          Redirecting you to your dashboard...
        </p>
      </motion.div>
    );
  }

  // Password strength requirements
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
  ];

  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Set new password</h1>
        <p className="mt-2 text-sm text-muted">
          Enter your new password below.
        </p>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-500"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleResetPassword} className="space-y-5">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-2"
          >
            New password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-xl border border-border bg-background pl-12 pr-4 py-3 text-sm placeholder-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="••••••••"
            />
          </div>
          <p className="mt-2 text-xs text-muted flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Use a strong password with mixed characters
          </p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-2"
          >
            Confirm new password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full rounded-xl border border-border bg-background pl-12 pr-4 py-3 text-sm placeholder-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Password strength indicator */}
        {password && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2 p-3 rounded-xl bg-background border border-border"
          >
            <p className="text-xs font-medium text-foreground">
              Password requirements:
            </p>
            <ul className="text-xs space-y-1">
              {requirements.map((req) => (
                <li 
                  key={req.label}
                  className={`flex items-center gap-2 ${req.met ? 'text-primary' : 'text-muted'}`}
                >
                  {req.met ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                  {req.label}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Updating password...
            </>
          ) : (
            'Update password'
          )}
        </motion.button>
      </form>
    </>
  );
}

function LoadingSpinner() {
  return (
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
      <p className="mt-4 text-sm text-muted">
        Loading...
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
