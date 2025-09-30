'use client';

import { useState } from 'react';
import { ProfileForm } from '@/components/profile-form';
import { PlanDisplay } from '@/components/plan-display';
import { ProgressTracker } from '@/components/progress-tracker';
import { Guidance } from '@/components/guidance';
import type { PlanState } from '@/app/actions';

export function WellnessDashboard() {
  const [plans, setPlans] = useState<PlanState | null>(null);

  const handlePlanGenerated = (generatedPlans: PlanState) => {
    setPlans(generatedPlans);
  };

  return (
    <div className="pb-12">
      {!plans?.dietPlan ? (
        <ProfileForm onPlanGenerated={handlePlanGenerated} />
      ) : (
        <div className="container mx-auto max-w-6xl px-4">
          <div className="space-y-8">
            <PlanDisplay
              dietPlan={plans.dietPlan}
              workoutRegimen={plans.workoutRegimen!}
            />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <ProgressTracker />
                <Guidance />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
