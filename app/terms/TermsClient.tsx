"use client";

import { FileCheck, Scaling, UserCheck, AlertTriangle } from "lucide-react";

export function TermsClient() {
  const sections = [
    {
      title: "Service Use",
      icon: UserCheck,
      color: "#b4f55a",
      content:
        "WellNourish AI provides personalized nutritional recommendations and meal plans. By using our service, you agree to provide accurate information and use the service in compliance with all applicable laws.",
    },
    {
      title: "Nutritional Advice Disclaimer",
      icon: AlertTriangle,
      color: "#f59e0b",
      content:
        "The content provided by WellNourish AI is for informational purposes only and does not constitute medical advice. Please consult with a healthcare professional before starting any new diet or exercise program.",
    },
    {
      title: "Accounts & Subscription",
      icon: Scaling,
      color: "#b4f55a",
      content:
        "You are responsible for maintaining the confidentiality of your account and password. We reserve the right to modify or terminate the service at any time for any reason without notice.",
    },
    {
      title: "Refund Policy",
      icon: FileCheck,
      color: "#b4f55a",
      content:
        "While we strive for excellence, nutritional needs vary. If you are unsatisfied with your plan, please contact our support team within 30 days for a full refund on your last purchase.",
    },
  ];

  return (
    <div className="flex flex-col items-center w-full min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-3xl w-full">

        {/* Eyebrow badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
          style={{
            background: "rgba(180,245,90,0.06)",
            border: "1px solid rgba(180,245,90,0.14)",
          }}
        >
          <FileCheck className="w-3 h-3" style={{ color: "#b4f55a" }} />
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "#b4f55a" }}
          >
            Legal
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
          Terms of Service
        </h1>

        <p className="text-lg mb-12 font-light leading-relaxed" style={{ color: "#5a6a5a" }}>
          The fine print made simple. These terms govern your use of our platform and all content
          generated through our AI engine.{" "}
          <span style={{ color: "#3a4a3a" }}>Last updated: April 2026.</span>
        </p>

        {/* Section cards */}
        <div className="space-y-5">
          {sections.map((section, idx) => {
            const isWarning = section.icon === AlertTriangle;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl transition-all duration-300"
                style={{
                  background: isWarning
                    ? "rgba(245,158,11,0.02)"
                    : "rgba(255,255,255,0.02)",
                  border: isWarning
                    ? "1px solid rgba(245,158,11,0.08)"
                    : "1px solid rgba(255,255,255,0.05)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = isWarning
                    ? "rgba(245,158,11,0.15)"
                    : "rgba(180,245,90,0.1)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = isWarning
                    ? "rgba(245,158,11,0.08)"
                    : "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: isWarning
                        ? "rgba(245,158,11,0.07)"
                        : "rgba(180,245,90,0.06)",
                      border: isWarning
                        ? "1px solid rgba(245,158,11,0.12)"
                        : "1px solid rgba(180,245,90,0.1)",
                    }}
                  >
                    <section.icon className="w-5 h-5" style={{ color: section.color }} />
                  </div>
                  <h2 className="text-xl font-semibold text-white tracking-tight">
                    {section.title}
                  </h2>
                </div>
                <p className="leading-relaxed font-light" style={{ color: "#4a5a4a" }}>
                  {section.content}
                </p>
              </div>
            );
          })}
        </div>

        {/* Contact card */}
        <div
          className="mt-14 p-8 rounded-2xl text-center"
          style={{
            background: "rgba(180,245,90,0.03)",
            border: "1px solid rgba(180,245,90,0.08)",
          }}
        >
          <p className="text-sm mb-3" style={{ color: "#4a5a4a" }}>
            Questions about our terms?
          </p>
          <a
            href="mailto:ashutoshswamy397@gmail.com"
            className="font-medium transition-colors"
            style={{ color: "#b4f55a" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#d4ff8a")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#b4f55a")
            }
          >
            ashutoshswamy397@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
