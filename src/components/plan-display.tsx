'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Utensils, Dumbbell } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PlanDisplayProps {
  dietPlan: string;
  workoutRegimen: string;
}

export function PlanDisplay({ dietPlan, workoutRegimen }: PlanDisplayProps) {
  return (
    <Tabs defaultValue="diet" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="diet">
          <Utensils className="mr-2 h-4 w-4" />
          Diet Plan
        </TabsTrigger>
        <TabsTrigger value="workout">
          <Dumbbell className="mr-2 h-4 w-4" />
          Workout Regimen
        </TabsTrigger>
      </TabsList>
      <TabsContent value="diet">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Your Personalized Diet Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="prose dark:prose-invert max-w-none rounded-lg border bg-secondary/50 p-4 text-secondary-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{dietPlan}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="workout">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Your Personalized Workout Regimen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="prose dark:prose-invert max-w-none rounded-lg border bg-secondary/50 p-4 text-secondary-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{workoutRegimen}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
