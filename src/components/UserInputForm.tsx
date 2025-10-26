"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type UserInputForm as UserInputFormType,
  userInputSchema,
} from "@/lib/validation";
import {
  User,
  Ruler,
  Weight,
  Activity,
  Utensils,
  ChefHat,
  AlertCircle,
  Target,
  Plus,
  X,
  Check,
} from "lucide-react";

const cuisineOptions = [
  "Indian",
  "Chinese",
  "Italian",
  "Mexican",
  "Japanese",
  "Thai",
  "Mediterranean",
  "American",
  "Korean",
  "Middle Eastern",
];

const dietOptions = [
  "Vegetarian",
  "Vegan",
  "Non-Vegetarian",
  "Pescatarian",
  "Keto",
  "Paleo",
];

interface Props {
  onSubmit: (data: UserInputFormType) => void;
  isLoading: boolean;
}

export default function UserInputForm({ onSubmit, isLoading }: Props) {
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [customCuisineInput, setCustomCuisineInput] = useState("");
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [customDietInput, setCustomDietInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UserInputFormType>({
    resolver: zodResolver(userInputSchema),
    defaultValues: {
      cuisinePreferences: [],
      dietPreference: "",
    },
  });

  const toggleCuisine = (cuisine: string) => {
    const newSelection = selectedCuisines.includes(cuisine)
      ? selectedCuisines.filter((c) => c !== cuisine)
      : [...selectedCuisines, cuisine];

    setSelectedCuisines(newSelection);
    setValue("cuisinePreferences", newSelection);
  };

  const addCustomCuisine = () => {
    if (
      customCuisineInput.trim() &&
      !selectedCuisines.includes(customCuisineInput.trim())
    ) {
      const newSelection = [...selectedCuisines, customCuisineInput.trim()];
      setSelectedCuisines(newSelection);
      setValue("cuisinePreferences", newSelection);
      setCustomCuisineInput("");
    }
  };

  const removeCuisine = (cuisine: string) => {
    const newSelection = selectedCuisines.filter((c) => c !== cuisine);
    setSelectedCuisines(newSelection);
    setValue("cuisinePreferences", newSelection);
  };

  const toggleDiet = (diet: string) => {
    const newSelection = selectedDiets.includes(diet)
      ? selectedDiets.filter((d) => d !== diet)
      : [...selectedDiets, diet];

    setSelectedDiets(newSelection);
    setValue("dietPreference", newSelection.join(", "));
  };

  const addCustomDiet = () => {
    if (
      customDietInput.trim() &&
      !selectedDiets.includes(customDietInput.trim())
    ) {
      const newSelection = [...selectedDiets, customDietInput.trim()];
      setSelectedDiets(newSelection);
      setValue("dietPreference", newSelection.join(", "));
      setCustomDietInput("");
    }
  };

  const removeDiet = (diet: string) => {
    const newSelection = selectedDiets.filter((d) => d !== diet);
    setSelectedDiets(newSelection);
    setValue("dietPreference", newSelection.join(", "));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 w-full max-w-4xl"
    >
      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden">
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJWMThoMnYxMnptLTggOGgtMlYyNmgydjEyem04LThoLTJWMThoMnYxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Create Your Personalized Plan
            </h2>
            <p className="text-white/90 text-lg font-light">
              Let's build your path to wellness together
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 md:p-10 space-y-8">
          {/* Section: Personal Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-700">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                  <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Age
                </label>
                <div className="relative">
                  <input
                    type="number"
                    {...register("age", { valueAsNumber: true })}
                    className="w-full px-4 py-4 border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white transition-all placeholder:text-zinc-400 group-hover:border-zinc-300 dark:group-hover:border-zinc-600"
                    placeholder="Enter your age"
                  />
                </div>
                {errors.age && (
                  <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.age.message}
                  </p>
                )}
              </div>

              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                  <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Gender
                </label>
                <div className="relative">
                  <select
                    {...register("gender")}
                    className="w-full px-4 py-4 border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white transition-all appearance-none cursor-pointer group-hover:border-zinc-300 dark:group-hover:border-zinc-600"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-zinc-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {errors.gender && (
                  <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Body Metrics */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-700">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 flex items-center justify-center">
                <Ruler className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                Body Metrics
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                  <Ruler className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  Height (cm)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    {...register("height", { valueAsNumber: true })}
                    className="w-full px-4 py-4 border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white transition-all placeholder:text-zinc-400 group-hover:border-zinc-300 dark:group-hover:border-zinc-600"
                    placeholder="e.g., 170"
                  />
                </div>
                {errors.height && (
                  <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.height.message}
                  </p>
                )}
              </div>

              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                  <Weight className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  Weight (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    {...register("weight", { valueAsNumber: true })}
                    className="w-full px-4 py-4 border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white transition-all placeholder:text-zinc-400 group-hover:border-zinc-300 dark:group-hover:border-zinc-600"
                    placeholder="e.g., 70"
                  />
                </div>
                {errors.weight && (
                  <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.weight.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Activity Level */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-700">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                Activity Level
              </h3>
            </div>

            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                How active are you?
              </label>
              <div className="relative">
                <select
                  {...register("activityLevel")}
                  className="w-full px-4 py-4 border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white transition-all appearance-none cursor-pointer group-hover:border-zinc-300 dark:group-hover:border-zinc-600"
                >
                  <option value="">Select your activity level</option>
                  <option value="sedentary">
                    🛋️ Sedentary (little or no exercise)
                  </option>
                  <option value="lightly_active">
                    🚶 Lightly Active (1-3 days/week)
                  </option>
                  <option value="moderately_active">
                    🏃 Moderately Active (3-5 days/week)
                  </option>
                  <option value="very_active">
                    💪 Very Active (6-7 days/week)
                  </option>
                  <option value="extremely_active">
                    🏆 Extremely Active (athlete level)
                  </option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-zinc-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {errors.activityLevel && (
                <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.activityLevel.message}
                </p>
              )}
            </div>
          </div>

          {/* Section: Diet Preferences */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-700">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 flex items-center justify-center">
                <Utensils className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                Diet Preferences
              </h3>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
                <Utensils className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                Select your dietary style
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {dietOptions.map((diet) => (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => toggleDiet(diet)}
                    className={`group relative px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-200 ${
                      selectedDiets.includes(diet)
                        ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg ring-2 ring-orange-400 ring-offset-2 dark:ring-offset-zinc-900 scale-105"
                        : "bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 border-2 border-zinc-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-700 hover:scale-105"
                    }`}
                  >
                    {selectedDiets.includes(diet) && (
                      <Check className="absolute top-2 right-2 w-4 h-4" />
                    )}
                    {diet}
                  </button>
                ))}
              </div>

              {/* Custom Diet Input */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={customDietInput}
                    onChange={(e) => setCustomDietInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomDiet();
                      }
                    }}
                    className="w-full px-4 py-4 pl-10 border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white transition-all placeholder:text-zinc-400"
                    placeholder="Add custom (e.g., Gluten-Free, Low-Carb)"
                  />
                  <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                </div>
                <button
                  type="button"
                  onClick={addCustomDiet}
                  disabled={!customDietInput.trim()}
                  className="px-6 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:from-zinc-300 disabled:to-zinc-300 dark:disabled:from-zinc-700 dark:disabled:to-zinc-700 text-white font-bold rounded-2xl transition-all hover:scale-105 transform disabled:cursor-not-allowed disabled:scale-100 shadow-lg"
                >
                  Add
                </button>
              </div>

              {/* Selected Diets Tags */}
              {selectedDiets.length > 0 && (
                <div className="flex flex-wrap gap-2 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-200 dark:border-orange-800">
                  {selectedDiets.map((diet) => (
                    <span
                      key={diet}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-sm font-bold shadow-md"
                    >
                      <Check className="w-4 h-4" />
                      {diet}
                      <button
                        type="button"
                        onClick={() => removeDiet(diet)}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {errors.dietPreference && (
                <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.dietPreference.message}
                </p>
              )}
            </div>
          </div>

          {/* Section: Cuisine Preferences */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-700">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                Cuisine Preferences
              </h3>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
                <ChefHat className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                What cuisines do you enjoy?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                {cuisineOptions.map((cuisine) => (
                  <button
                    key={cuisine}
                    type="button"
                    onClick={() => toggleCuisine(cuisine)}
                    className={`group relative px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-200 ${
                      selectedCuisines.includes(cuisine)
                        ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg ring-2 ring-pink-400 ring-offset-2 dark:ring-offset-zinc-900 scale-105"
                        : "bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 border-2 border-zinc-200 dark:border-zinc-700 hover:border-pink-300 dark:hover:border-pink-700 hover:scale-105"
                    }`}
                  >
                    {selectedCuisines.includes(cuisine) && (
                      <Check className="absolute top-2 right-2 w-4 h-4" />
                    )}
                    {cuisine}
                  </button>
                ))}
              </div>

              {/* Custom Cuisine Input */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={customCuisineInput}
                    onChange={(e) => setCustomCuisineInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomCuisine();
                      }
                    }}
                    className="w-full px-4 py-4 pl-10 border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white transition-all placeholder:text-zinc-400"
                    placeholder="Add custom cuisine (e.g., Vietnamese, Greek)"
                  />
                  <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                </div>
                <button
                  type="button"
                  onClick={addCustomCuisine}
                  disabled={!customCuisineInput.trim()}
                  className="px-6 py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 disabled:from-zinc-300 disabled:to-zinc-300 dark:disabled:from-zinc-700 dark:disabled:to-zinc-700 text-white font-bold rounded-2xl transition-all hover:scale-105 transform disabled:cursor-not-allowed disabled:scale-100 shadow-lg"
                >
                  Add
                </button>
              </div>

              {/* Selected Cuisines Tags */}
              {selectedCuisines.length > 0 && (
                <div className="flex flex-wrap gap-2 p-4 bg-pink-50 dark:bg-pink-900/10 rounded-2xl border border-pink-200 dark:border-pink-800">
                  {selectedCuisines.map((cuisine) => (
                    <span
                      key={cuisine}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-sm font-bold shadow-md"
                    >
                      <Check className="w-4 h-4" />
                      {cuisine}
                      <button
                        type="button"
                        onClick={() => removeCuisine(cuisine)}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {errors.cuisinePreferences && (
                <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.cuisinePreferences.message}
                </p>
              )}
            </div>
          </div>

          {/* Section: Allergies */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-700">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                Allergies & Restrictions
              </h3>
            </div>

            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                Food allergies or intolerances (Optional)
              </label>
              <textarea
                {...register("allergies")}
                className="w-full px-4 py-4 border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white transition-all resize-none placeholder:text-zinc-400 group-hover:border-zinc-300 dark:group-hover:border-zinc-600"
                placeholder="List any allergies (e.g., peanuts, shellfish, lactose intolerant)..."
                rows={3}
              />
              {errors.allergies && (
                <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.allergies.message}
                </p>
              )}
            </div>
          </div>

          {/* Section: Fitness Goals */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-700">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                Your Fitness Goals
              </h3>
            </div>

            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                What do you want to achieve?{" "}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                {...register("goals")}
                required
                className="w-full px-4 py-4 border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white transition-all resize-none placeholder:text-zinc-400 group-hover:border-zinc-300 dark:group-hover:border-zinc-600"
                placeholder="e.g., Lose 5kg in 3 months, Build muscle mass, Improve endurance for marathon training, Tone my body..."
                rows={4}
              />
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                💡 Be specific! The more detail you provide, the better your
                personalized plan will be.
              </p>
              {errors.goals && (
                <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.goals.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-pulse"></div>
        <button
          type="submit"
          disabled={isLoading}
          className="relative w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-bold py-6 px-8 rounded-3xl transition-all shadow-2xl hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transform text-lg"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>✨ Generating Your Personalized Plan...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-3">
              <Activity className="w-6 h-6" />
              <span>Generate My Wellness Plan</span>
              <span className="text-2xl">→</span>
            </span>
          )}
        </button>
      </div>

      {/* Footer Note */}
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        🔒 Your information is secure and used only to create your personalized
        plan
      </p>
    </form>
  );
}
