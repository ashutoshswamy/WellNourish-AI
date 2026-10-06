import Link from "next/link";
import { Logo } from "@/components/global/Logo";

const legal = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "https://github.com/ashutoshswamy/wellnourish-ai/blob/main/LICENSE", label: "License" },
];

const socials = [
  { href: "https://github.com/ashutoshswamy", label: "GitHub", icon: <svg className="size-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg> },
  { href: "https://linkedin.com/in/ashutoshswamy", label: "LinkedIn", icon: <svg className="size-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg> },
  { href: "https://x.com/ashutoshswamy_", label: "X", icon: <svg className="size-4 fill-current" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" /></svg> },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] md:items-end lg:px-8">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-ink-2">Seven days of meals, planned around your body and your kitchen.</p>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <div className="flex items-center gap-5 text-sm text-ink-2">
            {legal.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-ink" {...(l.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4 text-ink-3">
            {socials.map((s) => (
              <Link key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="hover:text-ink">
                {s.icon}
              </Link>
            ))}
          </div>
        </div>
        <p className="text-xs text-ink-3 md:col-span-2">&copy; {new Date().getFullYear()} WellNourish AI</p>
      </div>
    </footer>
  );
}
