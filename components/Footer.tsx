import Link from "next/link";
import { ShieldCheck, Linkedin, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-16 bg-secondary/50 dark:bg-secondary/30 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr] mb-12">
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="relative h-9 w-9 flex items-center justify-center rounded-lg bg-primary/10 p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/nobg.png"
                  alt="WellNourish AI Logo"
                  className="object-contain"
                />
              </div>
              <span className="font-semibold text-xl text-foreground tracking-tight">
                WellNourish AI
              </span>
            </div>
            <p className="text-muted-foreground max-w-sm leading-relaxed text-sm">
              The precision of a clinical team, the intelligence of deep learning, 
              and the simplicity of a single tap.
            </p>
            <div className="flex items-center gap-1">
              <SocialLink href="https://www.linkedin.com/in/ashutoshswamy" icon={<Linkedin className="h-4 w-4" />} label="LinkedIn" />
              <SocialLink href="https://github.com/ashutoshswamy" icon={<Github className="h-4 w-4" />} label="GitHub" />
              <SocialLink href="https://twitter.com/ashutoshswamy_" icon={<Twitter className="h-4 w-4" />} label="Twitter" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>
                <Link href="/#features" className="hover:text-foreground transition-colors">Features</Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-foreground transition-colors">How it Works</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-foreground transition-colors">Cookies Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} WellNourish AI. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5">
             <ShieldCheck className="w-3.5 h-3.5 text-primary" />
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
      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
    >
      {icon}
    </a>
  );
}
