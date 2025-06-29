import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export default async function HistoryPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase
    .from("plans")
    .select("id, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-4 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
        Your Plan History
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Generated Plans</CardTitle>
          <CardDescription>
            Here is a list of all your previously generated plans.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans && plans.length > 0 ? (
                plans.map((plan) => {
                  return (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">
                        {format(new Date(plan.created_at), "MMMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`/dashboard/plan/${plan.id}`}
                          className="underline"
                        >
                          View Plan
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    You haven&apos;t generated any plans yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
