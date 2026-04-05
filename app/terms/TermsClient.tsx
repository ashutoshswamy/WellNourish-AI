"use client";

import { motion } from "framer-motion";
import { FileCheck, Scaling, UserCheck, AlertTriangle } from "lucide-react";

export function TermsClient() {
  const sections = [
    {
      title: "Service Use",
      icon: <UserCheck className="w-5 h-5 text-lime-400" />,
      content: "WellNourish AI provides personalized nutritional recommendations and meal plans. By using our service, you agree to provide accurate information and use the service in compliance with all applicable laws.",
    },
    {
      title: "Nutritional Advice Disclaimer",
      icon: <AlertTriangle className="w-5 h-5 text-orange-400" />,
      content: "The content provided by WellNourish AI is for informational purposes only and does not constitute medical advice. Please consult with a healthcare professional before starting any new diet or exercise program.",
    },
    {
      title: "Accounts & Subscription",
      icon: <Scaling className="w-5 h-5 text-lime-400" />,
      content: "You are responsible for maintaining the confidentiality of your account and password. We reserve the right to modify or terminate the service at any time for any reason without notice.",
    },
    {
      title: "Refund Policy",
      icon: <FileCheck className="w-5 h-5 text-lime-400" />,
      content: "While we strive for excellence, nutritional needs vary. If you are unsatisfied with your plan, please contact our support team within 30 days for a full refund on your last purchase.",
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
          <FileCheck className="w-3 h-3 text-lime-400" />
          <span className="text-[10px] font-bold text-lime-400 uppercase tracking-widest">Legal</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Terms of Service
        </h1>
        
        <p className="text-[#8a9a8a] text-lg mb-12 font-light leading-relaxed">
          The fine print made simple. These terms govern your use of our platform and all content 
          generated through our AI engine. Last updated: April 2026.
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
            Questions about our terms?
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
