'use client';

import { useState, KeyboardEvent } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { dietaryOptions, type OnboardingData } from '@/lib/validations/onboarding';

export function DietaryPreferencesForm() {
  const {
    setValue,
    formState: { errors },
    control,
  } = useFormContext<OnboardingData>();

  const [customInput, setCustomInput] = useState('');

  const selectedPreferences = useWatch({
    control,
    name: 'dietary_preferences',
    defaultValue: [],
  });

  const togglePreference = (value: string) => {
    const currentValues = selectedPreferences || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    setValue('dietary_preferences', newValues, { shouldValidate: true });
  };

  const addCustomPreference = () => {
    const trimmed = customInput.trim();
    if (trimmed && !selectedPreferences?.includes(trimmed.toLowerCase())) {
      const currentValues = selectedPreferences || [];
      setValue('dietary_preferences', [...currentValues, trimmed.toLowerCase()], { shouldValidate: true });
      setCustomInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomPreference();
    }
  };

  const getDisplayLabel = (value: string) => {
    const option = dietaryOptions.find((o) => o.value === value);
    return option ? option.label : value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, ' ');
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">Dietary Preferences</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Select all dietary preferences that apply to you or add your own
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {dietaryOptions.map((option) => {
          const isSelected = selectedPreferences?.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => togglePreference(option.value)}
              className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
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
      <div className="mt-4">
        <label className="block text-sm font-medium text-foreground mb-2">
          Add custom dietary preference
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Low sodium, Whole30"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={addCustomPreference}
            disabled={!customInput.trim()}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {errors.dietary_preferences && (
        <p className="text-sm text-red-500 text-center">
          {errors.dietary_preferences.message}
        </p>
      )}

      {selectedPreferences && selectedPreferences.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Selected:</p>
          <div className="flex flex-wrap gap-2">
            {selectedPreferences.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm"
              >
                {getDisplayLabel(v)}
                <button
                  type="button"
                  onClick={() => togglePreference(v)}
                  className="ml-1 hover:text-emerald-900 dark:hover:text-emerald-200"
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
