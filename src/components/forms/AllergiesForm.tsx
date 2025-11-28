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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">Food Allergies</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Do you have any food allergies? Select all that apply or add your own (optional).
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {allergyOptions.map((option) => {
          const isSelected = selectedAllergies?.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleAllergy(option.value)}
              className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
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
      <div className="mt-4">
        <label className="block text-sm font-medium text-foreground mb-2">
          Add custom allergy
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Mustard, Celery"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={addCustomAllergy}
            disabled={!customInput.trim()}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {selectedAllergies && selectedAllergies.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 mb-2">⚠️ Allergies:</p>
          <div className="flex flex-wrap gap-2">
            {selectedAllergies.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm"
              >
                {getDisplayLabel(v)}
                <button
                  type="button"
                  onClick={() => toggleAllergy(v)}
                  className="ml-1 hover:text-red-900 dark:hover:text-red-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {(!selectedAllergies || selectedAllergies.length === 0) && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400">
            ✓ No allergies selected
          </p>
        </div>
      )}
    </div>
  );
}
