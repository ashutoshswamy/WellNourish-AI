"use client";

import { useState } from "react";
import {
  Leaf,
  ArrowLeft,
  User,
  LogOut,
  FileText,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface HeaderProps {
  onBackToHome?: () => void;
}

export function Header({ onBackToHome }: HeaderProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="relative px-section py-4 xs:py-6 md:py-8">
      {/* Back to Home Button */}
      {onBackToHome && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToHome}
          className="absolute left-3 top-4 xs:left-4 xs:top-6 md:top-8 sm:left-6 lg:left-8 touch-target-large focus-ring z-10"
        >
          <ArrowLeft className="h-4 w-4 mr-1 xs:mr-2" />
          <span className="hidden sm:inline text-sm">Back to Home</span>
          <span className="sm:hidden text-sm">Back</span>
        </Button>
      )}

      {/* Mobile Menu Button */}
      {user && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="absolute right-3 top-4 xs:right-4 xs:top-6 md:hidden touch-target-large focus-ring z-50"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      )}

      {/* Desktop User Menu */}
      <div className="absolute right-3 top-4 xs:right-4 xs:top-6 md:top-8 sm:right-6 lg:right-8 hidden md:flex">
        {user ? (
          <div className="flex items-center gap-1 xs:gap-2 lg:gap-4">
            {/* Navigation buttons when user is logged in */}
            <div className="flex items-center gap-1 xs:gap-2">
              {pathname !== "/" && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="touch-target focus-ring"
                >
                  <Link href="/" className="gap-1 xs:gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden lg:inline text-sm">Dashboard</span>
                  </Link>
                </Button>
              )}
              {pathname !== "/plans" && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="touch-target focus-ring"
                >
                  <Link href="/plans" className="gap-1 xs:gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="hidden lg:inline text-sm">History</span>
                  </Link>
                </Button>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 xs:gap-2 touch-target focus-ring"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden xl:inline max-w-24 xs:max-w-32 truncate text-sm">
                    {user.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 xs:w-56">
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/plans" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Plan History
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex gap-1 xs:gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="touch-target focus-ring"
            >
              <Link href="/login" className="text-sm">
                Sign In
              </Link>
            </Button>
            <Button size="sm" asChild className="touch-target focus-ring">
              <Link href="/signup" className="text-sm">
                Sign Up
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {user && mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="font-semibold text-lg">WellNourish AI</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeMobileMenu}
                className="touch-target focus-ring"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Menu Items */}
            <div className="flex-1 px-4 py-6 space-y-4">
              <div className="space-y-2">
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors touch-target focus-ring"
                >
                  <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link
                  href="/plans"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors touch-target focus-ring"
                >
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Plan History</span>
                </Link>
              </div>

              {/* User Info */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium text-sm truncate">
                    {user.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Menu Footer */}
            <div className="p-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="w-full justify-start gap-3 touch-target focus-ring"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Auth Buttons (when not logged in) */}
      {!user && (
        <div className="absolute right-3 top-4 xs:right-4 xs:top-6 md:hidden flex gap-1 xs:gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="touch-target focus-ring"
          >
            <Link href="/login" className="text-sm">
              Sign In
            </Link>
          </Button>
          <Button size="sm" asChild className="touch-target focus-ring">
            <Link href="/signup" className="text-sm">
              Sign Up
            </Link>
          </Button>
        </div>
      )}

      {/* Logo and Title */}
      <div className="flex items-center justify-center gap-2 xs:gap-3 md:gap-3">
        <Leaf className="h-6 w-6 xs:h-8 xs:w-8 md:h-10 md:w-10 text-primary" />
        <h1 className="text-xl xs:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-foreground font-sans">
          WellNourish AI
        </h1>
      </div>
      <p className="mt-2 xs:mt-3 md:mt-4 text-center text-xs xs:text-sm md:text-base lg:text-lg text-muted-foreground">
        Your personal AI-powered diet and workout planner.
      </p>
    </header>
  );
}
