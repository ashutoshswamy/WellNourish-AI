import Link from "next/link";
import { ShieldCheck, Sparkles, Linkedin, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-16 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_1fr] mb-12">
          <div>
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 rounded-2xl bg-slate-900/5 dark:bg-white/5 ring-1 ring-slate-900/5 dark:ring-white/10 p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/nobg.png"
                  alt="WellNourish AI Logo"
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-2xl text-slate-900 dark:text-white tracking-tight">
                WellNourish AI
              </span>
            </div>
            <p className="text-slate-500 mt-4 max-w-sm leading-relaxed">
              Professional-grade nutrition and training plans, orchestrated by
              AI and grounded in real-world science.
            </p>
            <div className="mt-6 flex items-center gap-4 text-slate-400">
              <a
                href="https://www.linkedin.com/in/ashutoshswamy"
                aria-label="LinkedIn"
                className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/ashutoshswamy"
                aria-label="GitHub"
                className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/ashutoshswamy_"
                aria-label="Twitter"
                className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
              Product
            </h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <Link
                  href="/#features"
                  className="flex items-center gap-2 hover:text-emerald-600 transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="flex items-center gap-2 hover:text-emerald-600 transition-colors"
                >
                  <ShieldCheck className="h-4 w-4" />
                  How it Works
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
              Legal
            </h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Cookies Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-400">
            © {new Date().getFullYear()} WellNourish AI. All rights reserved.
          </div>
          <div className="text-sm text-slate-400">
            Built with clinical-grade guidance and privacy-first principles.
          </div>
        </div>
      </div>
    </footer>
  );
}
