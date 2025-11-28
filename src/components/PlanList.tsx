'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { GeneratedPlan } from '@/types/database.types';
import { formatNumber } from '@/utils/formatNumber';
import { 
  Dumbbell, 
  ChevronRight,
  Utensils,
  Zap,
  Trash2,
  Loader2
} from 'lucide-react';

interface PlanListProps {
  plans: GeneratedPlan[];
}

export default function PlanList({ plans: initialPlans }: PlanListProps) {
  const router = useRouter();
  const [plans, setPlans] = useState(initialPlans);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, planId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this plan?')) {
      return;
    }

    setDeletingId(planId);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('generated_plans')
        .delete()
        .eq('id', planId);

      if (error) {
        console.error('Error deleting plan:', error);
        alert('Failed to delete plan. Please try again.');
      } else {
        setPlans(plans.filter(p => p.id !== planId));
        router.refresh();
      }
    } catch (err) {
      console.error('Error deleting plan:', err);
      alert('Failed to delete plan. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (plans.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="group flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
        >
          <Link
            href={`/plan?id=${plan.id}`}
            className="flex items-center gap-4 flex-1"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-110 transition-transform">
              {plan.plan_type === 'meal' && <Utensils className="h-5 w-5 text-primary" />}
              {plan.plan_type === 'workout' && <Dumbbell className="h-5 w-5 text-primary" />}
              {plan.plan_type === 'combined' && <Zap className="h-5 w-5 text-primary" />}
            </div>
            <div>
              <p className="font-semibold">{plan.plan_name}</p>
              <p className="text-sm text-muted">
                {new Date(plan.created_at).toLocaleDateString()} • {formatNumber(plan.daily_calories)} cal/day
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => handleDelete(e, plan.id)}
              disabled={deletingId === plan.id}
              className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/10 transition-all disabled:opacity-50"
              title="Delete plan"
            >
              {deletingId === plan.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
            <Link href={`/plan?id=${plan.id}`}>
              <ChevronRight className="h-5 w-5 text-muted group-hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
