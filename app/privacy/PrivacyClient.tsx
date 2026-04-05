"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export function PrivacyClient() {
  const sections = [
    {
      title: "Data We Collect",
      icon: <FileText className="w-5 h-5 text-lime-400" />,
      content: "We collect information you provide directly to us, such as your age, weight, height, activity level, dietary preferences, and allergies. This data is essential for generating your personalized meal plans.",
    },
    {
      title: "How We Use Your Data",
      icon: <Eye className="w-5 h-5 text-lime-400" />,
      content: "Your data is primarily used to power our AI systems to create nutritional recommendations tailored specifically to you. We also use it to improve our service and provide customer support.",
    },
    {
      title: "Data Security",
      icon: <Lock className="w-5 h-5 text-lime-400" />,
      content: "We implement industry-standard security measures to protect your personal information. Your health metrics are encrypted at rest and we never sell your personal data to third parties.",
    },
    {
      title: "Your Rights",
      icon: <Shield className="w-5 h-5 text-lime-400" />,
      content: "You have the right to access, correct, or delete your personal information at any time through your profile settings or by contacting our support team.",
    },
  ];

  return (
    <div className="flex flex-col items-center w-full min-h-screen pt-24 pb-20 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl w-full"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 mb-6">
          <Shield className="w-3 h-3 text-lime-400" />
          <span className="text-[10px] font-bold text-lime-400 uppercase tracking-widest">Legal</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Privacy Policy
        </h1>
        
        <p className="text-[#8a9a8a] text-lg mb-12 font-light leading-relaxed">
          At WellNourish AI, we take your privacy seriously. This policy explains how we collect, 
          use, and protect your personal health information. Last updated: April 2026.
        </p>

        <div className="space-y-8">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-lime-400/20 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-lime-400/10 flex items-center justify-center">
                  {section.icon}
                </div>
                <h2 className="text-xl font-semibold text-white tracking-tight">
                  {section.title}
                </h2>
              </div>
              <p className="text-[#6a7a6a] leading-relaxed font-light italic">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-lime-400/5 to-transparent border border-lime-400/10 text-center">
          <p className="text-sm text-[#8a9a8a] mb-4">
            Have questions about our privacy practices?
          </p>
          <a 
            href="mailto:ashutoshswamy397@gmail.com" 
            className="text-lime-400 hover:text-lime-300 font-medium transition-colors"
          >
            ashutoshswamy397@gmail.com
          </a>
        </div>
      </motion.div>
    </div>
  );
}
