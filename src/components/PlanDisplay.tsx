"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Sparkles,
  TrendingUp,
  Apple,
  Dumbbell,
  Lightbulb,
  Activity,
  Scale,
  Calendar,
} from "lucide-react";

interface Props {
  plan: {
    fullPlan: string;
    bmi: string;
    bmiCategory: string;
  };
  onReset: () => void;
}

// Custom renderer for markdown components
const MarkdownComponents = {
  h2: ({ children, ...props }: any) => {
    // Determine icon based on heading text
    let Icon = Sparkles;
    const text = String(children).toLowerCase();

    if (text.includes("nutrition") || text.includes("summary")) {
      Icon = Activity;
    } else if (text.includes("diet") || text.includes("meal")) {
      Icon = Apple;
    } else if (text.includes("workout") || text.includes("exercise")) {
      Icon = Dumbbell;
    } else if (text.includes("recommend")) {
      Icon = Lightbulb;
    }

    return (
      <div className="flex items-center gap-4 mt-12 mb-6 pb-4 border-b-2 border-gradient-to-r from-emerald-500 to-teal-500">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl shadow-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h2
          className="text-3xl font-bold text-zinc-900 dark:text-white m-0"
          {...props}
        >
          {children}
        </h2>
      </div>
    );
  },
  h3: ({ children, ...props }: any) => (
    <h3
      className="text-2xl font-semibold text-emerald-700 dark:text-emerald-400 mt-8 mb-4 flex items-center gap-2"
      {...props}
    >
      <Calendar className="w-5 h-5" />
      {children}
    </h3>
  ),
  p: ({ children, ...props }: any) => (
    <p
      className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4"
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="space-y-2 my-4 ml-6" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="space-y-2 my-4 ml-6 list-decimal" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li
      className="text-zinc-700 dark:text-zinc-300 leading-relaxed flex items-start gap-2"
      {...props}
    >
      <span className="text-emerald-500 mt-1 flex-shrink-0">●</span>
      <span>{children}</span>
    </li>
  ),
  strong: ({ children, ...props }: any) => (
    <strong className="font-semibold text-zinc-900 dark:text-white" {...props}>
      {children}
    </strong>
  ),
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-zinc-200 dark:border-zinc-700">
      <table
        className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: any) => (
    <thead
      className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20"
      {...props}
    >
      {children}
    </thead>
  ),
  th: ({ children, ...props }: any) => (
    <th
      className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-white"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td
      className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300 border-t border-zinc-200 dark:border-zinc-700"
      {...props}
    >
      {children}
    </td>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote
      className="border-l-4 border-emerald-500 pl-4 py-2 my-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-r-lg"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ children, ...props }: any) => (
    <code
      className="bg-zinc-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded text-sm font-mono"
      {...props}
    >
      {children}
    </code>
  ),
};

export default function PlanDisplay({ plan, onReset }: Props) {
  return (
    <div className="w-full max-w-5xl space-y-8">
      {/* BMI Card */}
      <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl shadow-2xl p-10 md:p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTR6TTI2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDRzMS43OSA0IDQgNCA0LTEuNzkgNC00ek00NiAzNGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDRzMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0czEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="text-center md:text-left flex items-center gap-6">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <Scale className="w-12 h-12 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2 opacity-90">
                Your BMI Score
              </h3>
              <p className="text-6xl font-bold mb-3">{plan.bmi}</p>
              <p className="text-lg font-semibold bg-white/25 backdrop-blur-sm px-5 py-2.5 rounded-xl inline-block">
                {plan.bmiCategory}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onReset}
              className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:bg-zinc-100 transition-all shadow-lg hover:shadow-2xl hover:scale-105 transform flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Create New Plan
            </button>
          </div>
        </div>
      </div>

      {/* Plan Content */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 md:p-14 border border-zinc-200 dark:border-zinc-800">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">AI-Powered Plan</span>
          </div>
          <h1 className="text-5xl font-bold text-zinc-900 dark:text-white mb-4 leading-tight">
            Your Personalized Wellness Plan
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 font-light max-w-2xl mx-auto">
            Crafted specifically for your goals, preferences, and lifestyle
          </p>
        </div>

        <div className="markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={MarkdownComponents}
          >
            {plan.fullPlan}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
