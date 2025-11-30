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
    <div className="w-full overflow-hidden">
      {/* Progress bar */}
      <div className="relative">
        <div className="h-1.5 sm:h-2 bg-border rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary to-secondary"
          />
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between mt-3 sm:mt-4 gap-1">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div
                key={step.id}
                className={`flex flex-col items-center flex-shrink-0 ${
                  index === 0 ? 'items-start' : index === steps.length - 1 ? 'items-end' : ''
                }`}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-md xs:rounded-lg sm:rounded-xl flex items-center justify-center text-[10px] xs:text-xs sm:text-sm font-semibold transition-all ${
                    isCompleted
                      ? 'bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/30'
                      : isCurrent
                      ? 'bg-gradient-to-br from-primary to-primary-dark text-white ring-1 xs:ring-2 sm:ring-4 ring-primary/20 shadow-lg shadow-primary/30'
                      : 'bg-card border border-border xs:border-2 text-muted'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                  ) : (
                    stepNumber
                  )}
                </motion.div>
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className={`mt-1 xs:mt-1.5 sm:mt-2 text-[8px] xs:text-[10px] sm:text-xs font-medium max-w-[40px] xs:max-w-[50px] sm:max-w-none text-center truncate ${
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
        className="mt-3 xs:mt-4 sm:mt-6 text-center"
      >
        <p className="text-[10px] xs:text-xs sm:text-sm text-muted">
          Step {currentStep} of {steps.length}
        </p>
      </motion.div>
    </div>
  );
}
