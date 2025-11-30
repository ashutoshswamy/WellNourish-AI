'use client';

import { useState, KeyboardEvent } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { allergyOptions, type OnboardingData } from '@/lib/validations/onboarding';

export function AllergiesForm() {
  const {
    setValue,
    control,
  } = useFormContext<OnboardingData>();

  const [customInput, setCustomInput] = useState('');

  const selectedAllergies = useWatch({
    control,
    name: 'allergies',
    defaultValue: [],
  });

  const toggleAllergy = (value: string) => {
    const currentValues = selectedAllergies || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    setValue('allergies', newValues, { shouldValidate: true });
  };

  const addCustomAllergy = () => {
    const trimmed = customInput.trim();
    if (trimmed && !selectedAllergies?.includes(trimmed.toLowerCase())) {
      const currentValues = selectedAllergies || [];
      setValue('allergies', [...currentValues, trimmed.toLowerCase()], { shouldValidate: true });
      setCustomInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomAllergy();
    }
  };

  const getDisplayLabel = (value: string) => {
    const option = allergyOptions.find((o) => o.value === value);
    return option ? option.label : value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, ' ');
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Food Allergies</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 sm:mt-2 text-sm sm:text-base">
          Do you have any food allergies? Select all that apply or add your own (optional).
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {allergyOptions.map((option) => {
          const isSelected = selectedAllergies?.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleAllergy(option.value)}
              className={`px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
                isSelected
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                  : 'border-gray-300 dark:border-gray-600 hover:border-red-300 text-foreground'
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
          Add custom allergy
        </label>
        <div className="flex flex-col xs:flex-row gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Mustard, Celery"
            className="flex-1 px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
          />
          <button
            type="button"
            onClick={addCustomAllergy}
            disabled={!customInput.trim()}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
          >
            Add
          </button>
        </div>
      </div>

      {selectedAllergies && selectedAllergies.length > 0 && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 mb-2">⚠️ Allergies:</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {selectedAllergies.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs sm:text-sm"
              >
                {getDisplayLabel(v)}
                <button
                  type="button"
                  onClick={() => toggleAllergy(v)}
                  className="ml-0.5 sm:ml-1 hover:text-red-900 dark:hover:text-red-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {(!selectedAllergies || selectedAllergies.length === 0) && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">
            ✓ No allergies selected
          </p>
        </div>
      )}
    </div>
  );
}
