'use client';

import { useState, KeyboardEvent } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { goalOptions, activityLevelOptions, type OnboardingData } from '@/lib/validations/onboarding';

export function GoalsForm() {
  const {
    register,
    setValue,
    formState: { errors },
    control,
  } = useFormContext<OnboardingData>();

  const [customGoalInput, setCustomGoalInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const selectedGoal = useWatch({
    control,
    name: 'goal',
    defaultValue: '',
  });

  const selectedActivityLevel = useWatch({
    control,
    name: 'activity_level',
  });

  const isPresetGoal = goalOptions.some((o) => o.value === selectedGoal);

  const handleCustomGoalSubmit = () => {
    const trimmed = customGoalInput.trim();
    if (trimmed) {
      setValue('goal', trimmed.toLowerCase().replace(/\s+/g, '_'), { shouldValidate: true });
      setCustomGoalInput('');
      setShowCustomInput(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomGoalSubmit();
    }
  };

  const getGoalDisplayLabel = (value: string) => {
    const option = goalOptions.find((o) => o.value === value);
    return option ? option.label : value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, ' ');
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">Your Goals</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          What are you looking to achieve with WellNourish AI?
        </p>
      </div>

      {/* Goal Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-foreground">
          Primary Goal
        </label>
        <div className="space-y-3">
          {goalOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-start p-4 rounded-lg border cursor-pointer transition-all ${
                selectedGoal === option.value
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-emerald-300'
              }`}
            >
              <input
                type="radio"
                value={option.value}
                {...register('goal')}
                className="sr-only"
              />
              <div className="flex-1">
                <div className={`font-medium ${
                  selectedGoal === option.value
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-foreground'
                }`}>
                  {option.label}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {option.description}
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedGoal === option.value
                  ? 'border-emerald-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {selectedGoal === option.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                )}
              </div>
            </label>
          ))}

          {/* Custom Goal Option */}
          {!showCustomInput && !selectedGoal && (
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="flex items-center justify-center w-full p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 hover:border-emerald-300 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
            >
              <span className="mr-2">+</span> Add custom goal
            </button>
          )}

          {/* Custom Goal Input */}
          {showCustomInput && (
            <div className="p-3 sm:p-4 rounded-lg border border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20">
              <label className="block text-sm font-medium text-foreground mb-2">
                Enter your custom goal
              </label>
              <div className="flex flex-col xs:flex-row gap-2">
                <input
                  type="text"
                  value={customGoalInput}
                  onChange={(e) => setCustomGoalInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g., Improve endurance"
                  className="flex-1 px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCustomGoalSubmit}
                    disabled={!customGoalInput.trim()}
                    className="flex-1 xs:flex-none px-3 sm:px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                  >
                    Set
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(false)}
                    className="flex-1 xs:flex-none px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Show custom goal if selected */}
          {selectedGoal && !isPresetGoal && (
            <div className="flex items-start p-4 rounded-lg border border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20">
              <div className="flex-1">
                <div className="font-medium text-emerald-600 dark:text-emerald-400">
                  {getGoalDisplayLabel(selectedGoal)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Custom goal
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setValue('goal', '', { shouldValidate: true });
                  setShowCustomInput(true);
                }}
                className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200"
              >
                Edit
              </button>
            </div>
          )}
        </div>
        {errors.goal && (
          <p className="text-sm text-red-500">{errors.goal.message}</p>
        )}
      </div>

      {/* Activity Level Selection */}
      <div className="space-y-3 sm:space-y-4">
        <label className="block text-sm font-medium text-foreground">
          Activity Level
        </label>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
          {activityLevelOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue('activity_level', option.value as OnboardingData['activity_level'], { shouldValidate: true })}
              className={`flex flex-col items-start p-3 sm:p-4 rounded-lg border transition-all text-left ${
                selectedActivityLevel === option.value
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-emerald-300'
              }`}
            >
              <div className={`font-medium text-sm sm:text-base ${
                selectedActivityLevel === option.value
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-foreground'
              }`}>
                {option.label}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1 line-clamp-2">
                {option.description}
              </div>
            </button>
          ))}
        </div>
        {errors.activity_level && (
          <p className="text-sm text-red-500">{errors.activity_level.message}</p>
        )}
      </div>
    </div>
  );
}
