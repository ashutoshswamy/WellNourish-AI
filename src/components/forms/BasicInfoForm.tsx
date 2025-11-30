'use client';

import { useFormContext } from 'react-hook-form';
import type { OnboardingData } from '@/lib/validations/onboarding';

export function BasicInfoForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<OnboardingData>();

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Basic Information</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 sm:mt-2 text-sm sm:text-base">
          Let&apos;s start with some basic details about you
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {/* Age */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-foreground mb-1.5 sm:mb-2">
            Age
          </label>
          <input
            id="age"
            type="number"
            placeholder="Enter your age"
            {...register('age', { valueAsNumber: true })}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-foreground placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm sm:text-base"
          />
          {errors.age && (
            <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.age.message}</p>
          )}
        </div>

        {/* Height */}
        <div>
          <label htmlFor="height_cm" className="block text-sm font-medium text-foreground mb-1.5 sm:mb-2">
            Height (cm)
          </label>
          <input
            id="height_cm"
            type="number"
            placeholder="Enter your height in cm"
            {...register('height_cm', { valueAsNumber: true })}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-foreground placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm sm:text-base"
          />
          {errors.height_cm && (
            <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.height_cm.message}</p>
          )}
        </div>

        {/* Weight */}
        <div>
          <label htmlFor="weight_kg" className="block text-sm font-medium text-foreground mb-1.5 sm:mb-2">
            Weight (kg)
          </label>
          <input
            id="weight_kg"
            type="number"
            step="0.1"
            placeholder="Enter your weight in kg"
            {...register('weight_kg', { valueAsNumber: true })}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-foreground placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm sm:text-base"
          />
          {errors.weight_kg && (
            <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.weight_kg.message}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5 sm:mb-2">
            Gender
          </label>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
            ].map((option) => (
              <label
                key={option.value}
                className="relative flex cursor-pointer"
              >
                <input
                  type="radio"
                  value={option.value}
                  {...register('gender')}
                  className="peer sr-only"
                />
                <div className="w-full px-2 sm:px-4 py-2.5 sm:py-3 text-center text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-900/20 peer-checked:text-emerald-600 dark:peer-checked:text-emerald-400 transition-all hover:border-emerald-300">
                  {option.label}
                </div>
              </label>
            ))}
          </div>
          {errors.gender && (
            <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.gender.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
