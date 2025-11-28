'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Clock, Dumbbell, Heart, Zap, Bed, TrendingUp, Activity } from 'lucide-react';
import type { WorkoutPlanData, Workout, Exercise } from '@/types/database.types';
import { formatNumber, formatSecondsToMinutes, formatMinutes } from '@/utils/formatNumber';

interface WorkoutPlanCardProps {
  workoutPlan: WorkoutPlanData;
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getWorkoutTypeIcon(type: Workout['workout_type']) {
  switch (type) {
    case 'strength':
      return <Dumbbell className="h-5 w-5" />;
    case 'cardio':
      return <Heart className="h-5 w-5" />;
    case 'flexibility':
      return <Zap className="h-5 w-5" />;
    case 'rest':
      return <Bed className="h-5 w-5" />;
    case 'mixed':
      return <Dumbbell className="h-5 w-5" />;
    default:
      return <Dumbbell className="h-5 w-5" />;
  }
}

function getWorkoutTypeColor(type: Workout['workout_type']) {
  switch (type) {
    case 'strength':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'cardio':
      return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
    case 'flexibility':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case 'rest':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    case 'mixed':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    default:
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  }
}

function ExerciseItem({ exercise, index }: { exercise: Exercise; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-primary/5"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-sm font-semibold text-primary">
            {index + 1}
          </div>
          <div>
            <h4 className="font-medium">
              {exercise.name}
            </h4>
            <p className="text-sm text-muted">
              {exercise.category}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted">
          {exercise.sets && exercise.reps && (
            <span className="font-medium">
              {formatNumber(exercise.sets)} × {formatNumber(exercise.reps)}
            </span>
          )}
          {exercise.duration_seconds && (
            <span>{formatSecondsToMinutes(exercise.duration_seconds)}</span>
          )}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4" />
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
            <div className="space-y-4 bg-background/50 p-5 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {exercise.sets && (
                  <span className="rounded-xl bg-blue-100 dark:bg-blue-900/30 px-3 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-400">
                    {formatNumber(exercise.sets)} sets
                  </span>
                )}
                {exercise.reps && (
                  <span className="rounded-xl bg-green-100 dark:bg-green-900/30 px-3 py-1.5 text-sm font-medium text-green-700 dark:text-green-400">
                    {formatNumber(exercise.reps)} reps
                  </span>
                )}
                {exercise.rest_seconds && (
                  <span className="rounded-xl bg-muted/30 px-3 py-1.5 text-sm font-medium">
                    {formatNumber(exercise.rest_seconds)}s rest
                  </span>
                )}
                {exercise.intensity && (
                  <span className="rounded-xl bg-orange-100 dark:bg-orange-900/30 px-3 py-1.5 text-sm font-medium text-orange-700 dark:text-orange-400">
                    {exercise.intensity} intensity
                  </span>
                )}
              </div>

              {exercise.instructions && exercise.instructions.length > 0 && (
                <div>
                  <h5 className="mb-2 text-sm font-semibold">
                    Instructions
                  </h5>
                  <ol className="list-inside list-decimal space-y-1.5 text-sm text-muted">
                    {exercise.instructions.map((instruction, idx) => (
                      <li key={idx} className="pl-1">{instruction}</li>
                    ))}
                  </ol>
                </div>
              )}

              {exercise.alternative_exercises && exercise.alternative_exercises.length > 0 && (
                <div>
                  <h5 className="mb-1 text-sm font-semibold">
                    Alternatives
                  </h5>
                  <p className="text-sm text-muted">
                    {exercise.alternative_exercises.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WorkoutDay({ workout, weekIndex }: { workout: Workout; weekIndex: number }) {
  const [isOpen, setIsOpen] = useState(weekIndex === 0);

  const isRestDay = workout.workout_type === 'rest';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: weekIndex * 0.05 }}
      className="overflow-hidden rounded-2xl border border-border bg-card"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-primary/5"
      >
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${getWorkoutTypeColor(workout.workout_type)}`}>
            {getWorkoutTypeIcon(workout.workout_type)}
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {workout.day_name || dayNames[(workout.day - 1) % 7] || `Day ${workout.day}`}
            </h3>
            <p className="text-sm text-muted">
              {isRestDay
                ? 'Rest & Recovery'
                : `${workout.focus_area || workout.workout_type} • ${workout.exercises.length} exercises`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!isRestDay && (
            <div className="flex items-center gap-1.5 text-sm text-muted">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium">{formatMinutes(workout.duration_minutes)}</span>
            </div>
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-5 w-5 text-muted" />
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
            {isRestDay ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted/20 flex items-center justify-center mb-4">
                  <Bed className="h-8 w-8 text-muted" />
                </div>
                <p className="text-muted">
                  Take this day to rest and recover. Light stretching or walking is encouraged.
                </p>
                {workout.notes && (
                  <p className="mt-3 text-sm text-muted/80">
                    {workout.notes}
                  </p>
                )}
              </div>
            ) : (
              <>
                {workout.exercises.map((exercise, exIndex) => (
                  <ExerciseItem key={exIndex} exercise={exercise} index={exIndex} />
                ))}
                {workout.notes && (
                  <div className="border-t border-border bg-primary/5 p-4">
                    <p className="text-sm text-muted flex items-center gap-2">
                      <span className="text-primary">💡</span> {workout.notes}
                    </p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function WorkoutPlanCard({ workoutPlan }: WorkoutPlanCardProps) {
  const [selectedWeek, setSelectedWeek] = useState(0);

  if (!workoutPlan || !workoutPlan.weeks || workoutPlan.weeks.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Dumbbell className="h-8 w-8 text-primary" />
        </div>
        <p className="text-muted">No workout plan available</p>
      </div>
    );
  }

  const currentWeek = workoutPlan.weeks[selectedWeek];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Workout Plan
        </h2>
        {workoutPlan.weeks.length > 1 && (
          <div className="flex gap-2">
            {workoutPlan.weeks.map((week, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedWeek(index)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  selectedWeek === index
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30'
                    : 'bg-card border border-border hover:border-primary/30'
                }`}
              >
                Week {week.week}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {workoutPlan.progression_strategy && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <TrendingUp className="h-4 w-4 text-primary" />
          {workoutPlan.progression_strategy}
        </div>
      )}

      <div className="space-y-4">
        {currentWeek.workouts.map((workout, index) => (
          <WorkoutDay key={index} workout={workout} weekIndex={index} />
        ))}
      </div>

      {workoutPlan.notes && workoutPlan.notes.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 p-5">
          <h4 className="mb-3 font-semibold text-primary flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Training Notes
          </h4>
          <ul className="space-y-2 text-sm text-muted">
            {workoutPlan.notes.map((note, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
