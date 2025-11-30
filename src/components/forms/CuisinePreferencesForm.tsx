'use client';

import { useState, KeyboardEvent } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { cuisineOptions, type OnboardingData } from '@/lib/validations/onboarding';

export function CuisinePreferencesForm() {
  const {
    setValue,
    formState: { errors },
    control,
  } = useFormContext<OnboardingData>();

  const [customInput, setCustomInput] = useState('');

  const selectedCuisines = useWatch({
    control,
    name: 'cuisine_preferences',
    defaultValue: [],
  });

  const toggleCuisine = (value: string) => {
    const currentValues = selectedCuisines || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    setValue('cuisine_preferences', newValues, { shouldValidate: true });
  };

  const addCustomCuisine = () => {
    const trimmed = customInput.trim();
    if (trimmed && !selectedCuisines?.includes(trimmed.toLowerCase())) {
      const currentValues = selectedCuisines || [];
      setValue('cuisine_preferences', [...currentValues, trimmed.toLowerCase()], { shouldValidate: true });
      setCustomInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomCuisine();
    }
  };

  const getDisplayLabel = (value: string) => {
    const option = cuisineOptions.find((o) => o.value === value);
    return option ? option.label : value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, ' ');
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Cuisine Preferences</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 sm:mt-2 text-sm sm:text-base">
          What types of cuisines do you enjoy? Select all that apply or add your own.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {cuisineOptions.map((option) => {
          const isSelected = selectedCuisines?.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleCuisine(option.value)}
              className={`px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                  : 'border-gray-300 dark:border-gray-600 hover:border-emerald-300 text-foreground'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Custom Input */}
      <div className="mt-3 sm:mt-4">
        <label className="block text-sm font-medium text-foreground mb-2">
          Add custom cuisine
        </label>
        <div className="flex flex-col xs:flex-row gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Caribbean, Ethiopian"
            className="flex-1 px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
          />
          <button
            type="button"
            onClick={addCustomCuisine}
            disabled={!customInput.trim()}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
          >
            Add
          </button>
        </div>
      </div>

      {errors.cuisine_preferences && (
        <p className="text-xs sm:text-sm text-red-500 text-center">
          {errors.cuisine_preferences.message}
        </p>
      )}

      {selectedCuisines && selectedCuisines.length > 0 && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">Selected:</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {selectedCuisines.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm"
              >
                {getDisplayLabel(v)}
                <button
                  type="button"
                  onClick={() => toggleCuisine(v)}
                  className="ml-0.5 sm:ml-1 hover:text-emerald-900 dark:hover:text-emerald-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
