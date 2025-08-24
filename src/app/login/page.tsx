'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { login, signup } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/Logo'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl bg-card/80 backdrop-blur-sm border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Link href="/" className="flex items-center gap-2">
                <Logo className="h-10 w-10 text-primary" />
              </Link>
            </div>
            <CardTitle className="font-headline text-3xl">Welcome to WellNourish AI</CardTitle>
            <CardDescription>Sign in to access your personalized wellness plans.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <p className="mb-4 text-center text-sm text-destructive bg-destructive/10 p-2 rounded-md">{error}</p>}
            {message && <p className="mb-4 text-center text-sm text-primary bg-primary/10 p-2 rounded-md">{message}</p>}
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" name="password" type={showPassword ? 'text' : 'password'} required />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                    <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                  </Button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                 <Button formAction={login} type="submit" className="w-full">Sign In</Button>
                 <Button formAction={signup} type="submit" variant="secondary" className="w-full">Sign Up</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
