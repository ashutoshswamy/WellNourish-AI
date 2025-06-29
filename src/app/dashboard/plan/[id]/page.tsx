import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PlanDisplay } from "@/components/dashboard/PlanDisplay";
import { format } from "date-fns";

type PlanPageProps = {
  params: {
    id: string;
  };
  searchParams: {
    new?: string;
  };
};

export default async function PlanPage({
  params,
  searchParams,
}: PlanPageProps) {
  const supabase = createClient();
  const { data: plan, error } = await supabase
    .from("plans")
    .select(
      "id, created_at, diet_plan, workout_plan, health_tips, generation_details"
    )
    .eq("id", params.id)
    .single();

  if (error || !plan) {
    notFound();
  }

  const isNew = searchParams.new === "true";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
          Your Personalized Plan
        </h1>
        <p className="text-muted-foreground">
          Generated on {format(new Date(plan.created_at), "MMMM d, yyyy")}
        </p>
      </div>
      <PlanDisplay plan={plan} isNew={isNew} />
    </div>
  );
}
