import Link from "next/link";
import { ShieldCheck, Sparkles, Linkedin, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-20 bg-slate-50 dark:bg-black border-t border-slate-200 dark:border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr] mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/nobg.png"
                  alt="WellNourish AI Logo"
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-2xl text-slate-900 dark:text-white tracking-tight">
                WellNourish<span className="text-emerald-500">AI</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed text-base">
              The precision of a clinical team, the intelligence of deep learning, 
              and the simplicity of a single tap.
            </p>
            <div className="flex items-center gap-5 text-slate-400">
              <SocialLink href="https://www.linkedin.com/in/ashutoshswamy" icon={<Linkedin className="h-5 w-5" />} label="LinkedIn" />
              <SocialLink href="https://github.com/ashutoshswamy" icon={<Github className="h-5 w-5" />} label="GitHub" />
              <SocialLink href="https://twitter.com/ashutoshswamy_" icon={<Twitter className="h-5 w-5" />} label="Twitter" />
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 text-lg">Platform</h4>
            <ul className="space-y-4 text-slate-500 dark:text-slate-400 font-medium">
              <li>
                <Link href="/#features" className="hover:text-emerald-500 transition-colors inline-block">Features</Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-emerald-500 transition-colors inline-block">How it Works</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-emerald-500 transition-colors inline-block">Login</Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-emerald-500 transition-colors inline-block">Pricing</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 text-lg">Company</h4>
            <ul className="space-y-4 text-slate-500 dark:text-slate-400 font-medium">
              <li>
                <Link href="/privacy" className="hover:text-emerald-500 transition-colors inline-block">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-500 transition-colors inline-block">Terms of Service</Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-emerald-500 transition-colors inline-block">Cookies Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400 dark:text-slate-500 font-medium">
          <div>
            © {new Date().getFullYear()} WellNourish AI. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
             <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Secure & Private by Design</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300"
    >
      {icon}
    </a>
  );
}
