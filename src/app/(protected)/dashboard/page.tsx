import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Profile, UserPreferences, GeneratedPlan } from '@/types/database.types';
import PlanList from '@/components/PlanList';
import { formatNumber } from '@/utils/formatNumber';
import { 
  Dumbbell, 
  Plus, 
  ClipboardList, 
  Settings, 
  Leaf,
  Sparkles,
  ChevronRight,
  Utensils,
  Zap,
  AlertCircle
} from 'lucide-react';

// Calculate BMR using Mifflin-St Jeor Equation
function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: string
): number {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

// Calculate TDEE based on activity level
function calculateTDEE(bmr: number, activityLevel: string): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9,
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.2));
}

// Calculate age from date of birth
function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single() as { data: Profile | null };

  // Fetch user preferences
  const { data: preferences } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single() as { data: UserPreferences | null };

  // Fetch active plan
  const { data: activePlan } = await supabase
    .from('generated_plans')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single() as { data: GeneratedPlan | null };

  // Fetch saved/favorite plans
  const { data: savedPlans } = await supabase
    .from('generated_plans')
    .select('id, plan_name, plan_type, daily_calories, created_at, is_favorite')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5) as { data: GeneratedPlan[] | null };

  // Calculate user stats
  const hasProfile = profile?.height_cm && profile?.weight_kg && profile?.date_of_birth;
  const age = profile?.date_of_birth ? calculateAge(profile.date_of_birth) : 30;
  const bmr = hasProfile
    ? calculateBMR(profile.weight_kg!, profile.height_cm!, age, profile.gender || 'other')
    : 0;
  const tdee = hasProfile && preferences
    ? calculateTDEE(bmr, preferences.activity_level)
    : 0;

  // Check if user needs onboarding
  const needsOnboarding = !preferences;

  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Leaf className="h-7 w-7 text-primary group-hover:rotate-12 transition-transform" />
            <span className="text-xl font-bold gradient-text">WellNourish AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted hidden sm:block">
              {profile?.full_name || user.email}
            </span>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="text-sm font-medium px-4 py-2 rounded-xl bg-card border border-border hover:border-primary/50 transition-all"
              >
                Sign out
              </button>
            </form>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋
          </h1>
          <p className="mt-2 text-muted">
            Here&apos;s your personalized wellness overview.
          </p>
        </div>

        {/* Onboarding Alert */}
        {needsOnboarding && (
          <div className="mb-8 p-5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <AlertCircle className="h-6 w-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Complete Your Profile</h3>
                <p className="text-sm text-muted mt-1">
                  Set up your preferences to get personalized meal and workout plans.
                </p>
                <Link
                  href="/onboarding"
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
                >
                  Complete Setup
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Latest Plan Banner */}
        {activePlan && (
          <div className="mb-8 p-6 bg-gradient-to-r from-primary to-secondary rounded-2xl text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            </div>
            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5" />
                  <p className="text-white/80 text-sm font-medium">Latest Plan</p>
                </div>
                <h2 className="text-2xl font-bold">{activePlan.plan_name}</h2>
                <p className="text-white/80 text-sm mt-2">
                  {formatNumber(activePlan.daily_calories)} cal/day
                </p>
              </div>
              <Link
                href="/plan"
                className="px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-medium transition-all flex items-center gap-2"
              >
                View Plan
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-card rounded-2xl p-6 border border-border mb-8">
          <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Quick Actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link 
              href="/onboarding"
              className="group flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses.green} group-hover:scale-110 transition-transform`}>
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Generate New Plan</p>
                <p className="text-sm text-muted">Create personalized plan</p>
              </div>
            </Link>
            {activePlan ? (
              <Link 
                href="/plan"
                className="group flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses.blue} group-hover:scale-110 transition-transform`}>
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">View Current Plan</p>
                  <p className="text-sm text-muted">See meals & workouts</p>
                </div>
              </Link>
            ) : (
              <Link 
                href="/onboarding"
                className="group flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses.blue} group-hover:scale-110 transition-transform`}>
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Create Your First Plan</p>
                  <p className="text-sm text-muted">Get started now</p>
                </div>
              </Link>
            )}
            <Link 
              href="/onboarding"
              className="group flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses.purple} group-hover:scale-110 transition-transform`}>
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Update Preferences</p>
                <p className="text-sm text-muted">Modify your goals</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Plans */}
        {savedPlans && savedPlans.length > 0 && (
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Recent Plans
            </h2>
            <PlanList plans={savedPlans} />
          </div>
        )}

        {/* Empty State */}
        {(!savedPlans || savedPlans.length === 0) && !needsOnboarding && (
          <div className="bg-card rounded-2xl p-10 border border-border text-center">
            <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-6">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">No Plans Yet</h3>
            <p className="text-muted mt-2 mb-6 max-w-md mx-auto">
              Generate your first personalized meal and workout plan to get started on your wellness journey.
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
            >
              Generate Your First Plan
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
