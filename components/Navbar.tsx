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

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
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
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`fixed top-4 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-300 ${scrolled ? "top-4" : "top-6"}`}
    >
      <div className={`
        relative w-full max-w-5xl rounded-full transition-all duration-300
        ${scrolled 
          ? "glass shadow-2xl bg-white/80 dark:bg-slate-900/80 p-2" 
          : "bg-transparent p-2"
        }
      `}>
        <div className="flex justify-between items-center px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className={`
              relative h-10 w-10 flex items-center justify-center rounded-full 
              transition-all duration-300 
              ${scrolled ? "bg-emerald-500/10" : "bg-white/10 backdrop-blur-md"}
            `}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/nobg.png"
                alt="WellNourish AI Logo"
                className="h-8 w-8 object-contain transition-transform group-hover:scale-110"
              />
            </div>
            <span className={`font-bold text-lg tracking-tight transition-colors ${scrolled ? "text-slate-900 dark:text-white" : "text-slate-900 dark:text-white"}`}>
              WellNourish<span className="text-emerald-500">AI</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/#features" scrolled={scrolled}>Features</NavLink>
            <NavLink href="/#how-it-works" scrolled={scrolled}>How it Works</NavLink>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2" />

            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  className={`
                    flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-all
                    ${scrolled 
                      ? "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200" 
                      : "bg-white/10 hover:bg-white/20 text-slate-900 dark:text-white backdrop-blur-md"
                    }
                  `}
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Account</span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-3 w-56 glass rounded-2xl p-2 overflow-hidden origin-top-right"
                    >
                      <Link href="/dashboard" onClick={() => setProfileOpen(false)}>
                        <div className="px-4 py-2.5 text-sm rounded-xl text-slate-700 dark:text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center cursor-pointer">
                          <LayoutDashboard className="h-4 w-4 mr-3" />
                          Dashboard
                        </div>
                      </Link>
                      <Link href="/profile" onClick={() => setProfileOpen(false)}>
                        <div className="px-4 py-2.5 text-sm rounded-xl text-slate-700 dark:text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center cursor-pointer">
                          <UserIcon className="h-4 w-4 mr-3" />
                          Profile
                        </div>
                      </Link>
                      <div className="h-px bg-slate-200 dark:bg-slate-700 my-1 mx-2" />
                      <div
                        onClick={handleSignOut}
                        className="px-4 py-2.5 text-sm rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center cursor-pointer"
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
                  <Button variant="ghost" size="sm" className="rounded-full hover:bg-emerald-500/10 hover:text-emerald-600">
                    Log In
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="sm" className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
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
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="md:hidden overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl"
            >
              <div className="p-4 space-y-2">
                <MobileLink href="/#features" onClick={() => setIsOpen(false)}>Features</MobileLink>
                <MobileLink href="/#how-it-works" onClick={() => setIsOpen(false)}>How it Works</MobileLink>
                
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
                
                {user ? (
                  <>
                    <MobileLink href="/dashboard" onClick={() => setIsOpen(false)} icon={<LayoutDashboard size={18} />}>Dashboard</MobileLink>
                    <MobileLink href="/profile" onClick={() => setIsOpen(false)} icon={<UserIcon size={18} />}>Profile</MobileLink>
                    <button
                       onClick={handleSignOut}
                       className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                    >
                      <LogOut size={18} className="mr-3" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full rounded-xl">Log In</Button>
                    </Link>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600">Get Started</Button>
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

function NavLink({ href, scrolled, children }: { href: string; scrolled: boolean; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className={`
        px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
        ${scrolled 
          ? "text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400" 
          : "text-slate-800 dark:text-slate-200 hover:bg-white/20 backdrop-blur-sm"
        }
      `}
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
      className="flex items-center px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
    >
      {icon && <span className="mr-3">{icon}</span>}
      {children}
    </Link>
  );
}
