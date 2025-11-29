'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Clock, Flame, Utensils, Calendar, Salad } from 'lucide-react';
import type { MealPlanData, Meal, DailyMealPlan } from '@/types/database.types';
import { formatNumber, formatCalories, formatGrams } from '@/utils/formatNumber';

interface MealPlanCardProps {
  mealPlan: MealPlanData;
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getMealIcon(mealType: Meal['meal_type']) {
  const icons: Record<Meal['meal_type'], string> = {
    breakfast: '🍳',
    lunch: '🥗',
    dinner: '🍽️',
    snack: '🍎',
  };
  return icons[mealType] || '🍴';
}

function MealItem({ meal }: { meal: Meal }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-primary/5"
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="text-xl sm:text-2xl shrink-0">{getMealIcon(meal.meal_type)}</span>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-primary">
              {meal.meal_type}
            </span>
            <h4 className="font-medium text-sm sm:text-base truncate">
              {meal.name}
            </h4>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-muted">
            <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
            <span className="font-medium">{formatCalories(meal.nutrition.calories)}</span>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 sm:space-y-4 bg-background/50 p-3 sm:p-5 border-t border-border">
              {meal.description && (
                <p className="text-xs sm:text-sm text-muted">
                  {meal.description}
                </p>
              )}

              {/* Time info */}
              <div className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm text-muted flex-wrap">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <span>Prep: {meal.prep_time_minutes} min</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Utensils className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <span>Cook: {meal.cook_time_minutes} min</span>
                </div>
                <span>Servings: {meal.servings}</span>
              </div>

              {/* Macros */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <div className="rounded-lg sm:rounded-xl bg-orange-100 dark:bg-orange-900/30 p-2 sm:p-3 text-center">
                  <div className="text-base sm:text-lg font-bold text-orange-600 dark:text-orange-400">
                    {formatNumber(meal.nutrition.calories)}
                  </div>
                  <div className="text-[10px] sm:text-xs font-medium text-orange-600/80 dark:text-orange-400/80">Calories</div>
                </div>
                <div className="rounded-lg sm:rounded-xl bg-blue-100 dark:bg-blue-900/30 p-2 sm:p-3 text-center">
                  <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formatGrams(meal.nutrition.protein_g)}
                  </div>
                  <div className="text-[10px] sm:text-xs font-medium text-blue-600/80 dark:text-blue-400/80">Protein</div>
                </div>
                <div className="rounded-lg sm:rounded-xl bg-green-100 dark:bg-green-900/30 p-2 sm:p-3 text-center">
                  <div className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
                    {formatGrams(meal.nutrition.carbs_g)}
                  </div>
                  <div className="text-[10px] sm:text-xs font-medium text-green-600/80 dark:text-green-400/80">Carbs</div>
                </div>
                <div className="rounded-lg sm:rounded-xl bg-purple-100 dark:bg-purple-900/30 p-2 sm:p-3 text-center">
                  <div className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
                    {formatGrams(meal.nutrition.fats_g)}
                  </div>
                  <div className="text-[10px] sm:text-xs font-medium text-purple-600/80 dark:text-purple-400/80">Fats</div>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <h5 className="mb-2 sm:mb-3 font-semibold text-sm sm:text-base">
                  Ingredients
                </h5>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted">
                  {meal.ingredients.map((ingredient, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span className="break-words">
                        {ingredient.amount} {ingredient.unit} {ingredient.name}
                        {ingredient.notes && (
                          <span className="opacity-70"> ({ingredient.notes})</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              {meal.instructions && meal.instructions.length > 0 && (
                <div>
                  <h5 className="mb-2 sm:mb-3 font-semibold text-sm sm:text-base">
                    Instructions
                  </h5>
                  <ol className="list-inside list-decimal space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted">
                    {meal.instructions.map((instruction, idx) => (
                      <li key={idx} className="pl-1">{instruction}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DayAccordion({ day, dayIndex }: { day: DailyMealPlan; dayIndex: number }) {
  const [isOpen, setIsOpen] = useState(dayIndex === 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: dayIndex * 0.1 }}
      className="overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-3 sm:p-5 text-left transition-colors hover:bg-primary/5"
      >
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-secondary text-xs sm:text-sm font-bold text-white shadow-lg shadow-primary/30 shrink-0">
            D{day.day}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-base sm:text-lg truncate">
              {dayNames[(dayIndex) % 7] || `Day ${day.day}`}
            </h3>
            <p className="text-xs sm:text-sm text-muted">
              {day.meals.length} meals • {formatNumber(day.total_calories)} cal
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted flex-wrap">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">{formatGrams(day.total_protein_g)} protein</span>
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-medium">{formatGrams(day.total_carbs_g)} carbs</span>
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium">{formatGrams(day.total_fats_g)} fats</span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-border"
          >
            {day.meals.map((meal, mealIndex) => (
              <MealItem key={mealIndex} meal={meal} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MealPlanCard({ mealPlan }: MealPlanCardProps) {
  if (!mealPlan || !mealPlan.days || mealPlan.days.length === 0) {
    return (
      <div className="rounded-xl sm:rounded-2xl border border-border bg-card p-6 sm:p-8 text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
          <Salad className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
        </div>
        <p className="text-sm sm:text-base text-muted">No meal plan available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Weekly Meal Plan
        </h2>
        <span className="rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-primary border border-primary/20 w-fit">
          {mealPlan.days.length} days
        </span>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {mealPlan.days.map((day, index) => (
          <DayAccordion key={index} day={day} dayIndex={index} />
        ))}
      </div>
    </div>
  );
}
