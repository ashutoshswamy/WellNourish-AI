"use client";

import { Shield, Lock, Eye, FileText } from "lucide-react";

export function PrivacyClient() {
  const sections = [
    {
      title: "Data We Collect",
      icon: FileText,
      color: "#b4f55a",
      content:
        "We collect information you provide directly to us, such as your age, weight, height, activity level, dietary preferences, and allergies. This data is essential for generating your personalized meal plans.",
    },
    {
      title: "How We Use Your Data",
      icon: Eye,
      color: "#b4f55a",
      content:
        "Your data is primarily used to power our AI systems to create nutritional recommendations tailored specifically to you. We also use it to improve our service and provide customer support.",
    },
    {
      title: "Data Security",
      icon: Lock,
      color: "#b4f55a",
      content:
        "We implement industry-standard security measures to protect your personal information. Your health metrics are encrypted at rest and we never sell your personal data to third parties.",
    },
    {
      title: "Your Rights",
      icon: Shield,
      color: "#b4f55a",
      content:
        "You have the right to access, correct, or delete your personal information at any time through your profile settings or by contacting our support team.",
    },
  ];

  return (
    <div
      className="flex flex-col items-center w-full min-h-screen pt-24 pb-20 px-6"
    >
      <div className="max-w-3xl w-full">

        {/* Eyebrow badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
          style={{
            background: "rgba(180,245,90,0.06)",
            border: "1px solid rgba(180,245,90,0.14)",
          }}
        >
          <Shield className="w-3 h-3" style={{ color: "#b4f55a" }} />
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "#b4f55a" }}
          >
            Legal
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
          Privacy Policy
        </h1>

        <p className="text-lg mb-12 font-light leading-relaxed" style={{ color: "#5a6a5a" }}>
          At WellNourish AI, we take your privacy seriously. This policy explains how we collect,
          use, and protect your personal health information.{" "}
          <span style={{ color: "#3a4a3a" }}>Last updated: April 2026.</span>
        </p>

        {/* Section cards */}
        <div className="space-y-5">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl transition-all duration-300 group"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(180,245,90,0.1)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.05)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(180,245,90,0.06)",
                    border: "1px solid rgba(180,245,90,0.1)",
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
          ))}
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
            Have questions about our privacy practices?
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
