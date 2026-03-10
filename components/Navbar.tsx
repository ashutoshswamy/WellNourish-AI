"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    setProfileOpen(false);
  };

  const navVariants: Variants = {
    hidden: { y: -10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className={`
        w-full transition-all duration-300 border-b
        ${scrolled 
          ? "bg-background/95 backdrop-blur-md border-border shadow-sm" 
          : "bg-transparent border-transparent"
        }
      `}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="relative h-9 w-9 flex items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/nobg.png"
                  alt="WellNourish AI Logo"
                  className="h-7 w-7 object-contain"
                />
              </div>
              <span className="font-semibold text-base tracking-tight text-foreground">
                WellNourish AI
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink href="/#features">Features</NavLink>
              <NavLink href="/#how-it-works">How it Works</NavLink>
              
              <div className="h-5 w-px bg-border mx-3" />

              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>Account</span>
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 bg-background rounded-xl border border-border shadow-lg p-1.5 origin-top-right"
                      >
                        <Link href="/dashboard" onClick={() => setProfileOpen(false)}>
                          <div className="px-3 py-2.5 text-sm rounded-lg text-foreground hover:bg-muted transition-colors flex items-center cursor-pointer">
                            <LayoutDashboard className="h-4 w-4 mr-3 text-muted-foreground" />
                            Dashboard
                          </div>
                        </Link>
                        <Link href="/profile" onClick={() => setProfileOpen(false)}>
                          <div className="px-3 py-2.5 text-sm rounded-lg text-foreground hover:bg-muted transition-colors flex items-center cursor-pointer">
                            <UserIcon className="h-4 w-4 mr-3 text-muted-foreground" />
                            Profile
                          </div>
                        </Link>
                        <div className="h-px bg-border my-1 mx-1" />
                        <div
                          onClick={handleSignOut}
                          className="px-3 py-2.5 text-sm rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/15 transition-colors flex items-center cursor-pointer"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="sm">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-border bg-background"
            >
              <div className="px-4 py-3 space-y-1">
                <MobileLink href="/#features" onClick={() => setIsOpen(false)}>Features</MobileLink>
                <MobileLink href="/#how-it-works" onClick={() => setIsOpen(false)}>How it Works</MobileLink>
                
                <div className="h-px bg-border my-2" />
                
                {user ? (
                  <>
                    <MobileLink href="/dashboard" onClick={() => setIsOpen(false)} icon={<LayoutDashboard size={16} />}>Dashboard</MobileLink>
                    <MobileLink href="/profile" onClick={() => setIsOpen(false)} icon={<UserIcon size={16} />}>Profile</MobileLink>
                    <button
                       onClick={handleSignOut}
                       className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                    >
                      <LogOut size={16} className="mr-3" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">Log In</Button>
                    </Link>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileLink({ href, onClick, icon, children }: { href: string; onClick: () => void; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="flex items-center px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
    >
      {icon && <span className="mr-3">{icon}</span>}
      {children}
    </Link>
  );
}
