import { Sparkles, Brain, Dumbbell, Apple } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12">
      <div className="relative">
        {/* Main spinning circle */}
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-emerald-500"></div>
        <div
          className="absolute top-0 left-0 animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-teal-400 opacity-50"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        ></div>

        {/* Center icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Brain className="w-8 h-8 text-emerald-500 animate-pulse" />
        </div>
      </div>

      <div className="text-center space-y-3 max-w-md">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-emerald-500 animate-pulse" />
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">
            Creating Your Personalized Plan
          </p>
          <Sparkles className="w-6 h-6 text-emerald-500 animate-pulse" />
        </div>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Our AI is analyzing your profile and crafting a perfect plan for
          you...
        </p>
      </div>

      {/* Feature indicators */}
      <div className="flex items-center gap-6 mt-4">
        <div className="flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl">
            <Apple className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Nutrition
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
          <div className="bg-teal-100 dark:bg-teal-900/30 p-3 rounded-xl">
            <Dumbbell className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          </div>
          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Workouts
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
          <div className="bg-cyan-100 dark:bg-cyan-900/30 p-3 rounded-xl">
            <Sparkles className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Tips
          </span>
        </div>
      </div>

      {/* Animated dots */}
      <div className="flex space-x-2">
        <div
          className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-3 h-3 bg-teal-500 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );
}
