'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface OnboardingStepperProps {
  currentStep: number;
  steps: Step[];
}

export function OnboardingStepper({ currentStep, steps }: OnboardingStepperProps) {
  const progress = useMemo(() => {
    return ((currentStep) / steps.length) * 100;
  }, [currentStep, steps.length]);

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative">
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary to-secondary"
          />
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between mt-4">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  index === 0 ? 'items-start' : index === steps.length - 1 ? 'items-end' : ''
                }`}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-all ${
                    isCompleted
                      ? 'bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/30'
                      : isCurrent
                      ? 'bg-gradient-to-br from-primary to-primary-dark text-white ring-4 ring-primary/20 shadow-lg shadow-primary/30'
                      : 'bg-card border-2 border-border text-muted'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </motion.div>
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className={`mt-2 text-xs font-medium hidden sm:block ${
                    isCurrent
                      ? 'text-primary'
                      : isCompleted
                      ? 'text-primary/80'
                      : 'text-muted'
                  }`}
                >
                  {step.title}
                </motion.span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current step info */}
      <motion.div 
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-muted">
          Step {currentStep} of {steps.length}
        </p>
      </motion.div>
    </div>
  );
}
