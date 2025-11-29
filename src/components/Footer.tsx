'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Leaf, 
  Heart,
  Github,
  Twitter,
  Linkedin,
  ArrowUpRight
} from "lucide-react";

const footerLinks = {
  product: [
    { name: "Features", href: "/#features" },
    { name: "How It Works", href: "/#how-it-works" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
};

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/ashutoshswamy_" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/in/ashutoshswamy" },
  { name: "GitHub", icon: Github, href: "https://github.com/ashutoshswamy" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-card/50 backdrop-blur-sm">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-primary/[0.05] pointer-events-none" />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="col-span-2 md:col-span-3 lg:col-span-2">
              <Link href="/" className="inline-flex items-center gap-2 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-colors" />
                  <Leaf className="relative h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <span className="text-lg sm:text-xl font-bold gradient-text">WellNourish AI</span>
              </Link>
              
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted max-w-xs leading-relaxed">
                Your AI-powered nutrition and wellness companion. Transform your health with personalized meal plans and workout routines.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-3 sm:mb-4">Product</h3>
              <ul className="space-y-2 sm:space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-muted hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-3 sm:mb-4">Legal</h3>
              <ul className="space-y-2 sm:space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-muted hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Copyright */}
            <div className="flex flex-wrap items-center justify-center gap-1 text-xs sm:text-sm text-muted text-center">
              <span>© {currentYear} WellNourish AI. Made with</span>
              <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-red-500 fill-red-500 inline-block mx-0.5" />
              <span>for your health.</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-1">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 sm:p-2 text-muted hover:text-foreground hover:bg-primary/10 rounded-lg transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
