"use client";

import Link from "next/link";
import { Logo } from "@/components/global/Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative z-10 w-full py-12 mt-auto"
      style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left — Logo + copyright */}
        <div className="flex flex-col items-center md:items-start gap-2.5">
          <Logo iconSize={14} textSize="text-sm" />
          <p className="text-xs font-medium" style={{ color: "#2a3a2a" }}>
            © {currentYear} WellNourish AI. All rights reserved.
          </p>
        </div>

        {/* Center — Links */}
        <div className="flex items-center gap-8">
          {[
            { href: "/privacy", label: "Privacy Policy" },
            { href: "/terms", label: "Terms of Service" },
            {
              href: "https://github.com/ashutoshswamy/wellnourish-ai/blob/main/LICENSE",
              label: "License",
              external: true,
            },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-xs transition-colors duration-200"
              style={{ color: "#4a5a4a" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#b4f55a";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#4a5a4a";
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right — Social + tagline */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <p
            className="text-xs text-center md:text-right leading-relaxed"
            style={{ color: "#2a3a2a" }}
          >
            Personalized AI nutrition,
            <br />
            crafted with ❤️ for a healthier you.
          </p>

          <div className="flex items-center gap-4">
            {[
              {
                href: "https://github.com/ashutoshswamy",
                label: "GitHub",
                icon: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                ),
              },
              {
                href: "https://linkedin.com/in/ashutoshswamy",
                label: "LinkedIn",
                icon: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                ),
              },
              {
                href: "https://x.com/ashutoshswamy_",
                label: "X (Twitter)",
                icon: (
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
                  </svg>
                ),
              },
            ].map((social) => (
              <Link
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                title={social.label}
                className="transition-colors duration-200"
                style={{ color: "#3a4a3a" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#b4f55a";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#3a4a3a";
                }}
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom glow line */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-full max-w-2xl"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(180,245,90,0.12), transparent)",
        }}
      />
    </footer>
  );
}
