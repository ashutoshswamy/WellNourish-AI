'use client';

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartTooltipContent } from '@/components/ui/chart';

const data = [
  { month: 'Jan', weight: 80 },
  { month: 'Feb', weight: 79 },
  { month: 'Mar', weight: 79 },
  { month: 'Apr', weight: 77 },
  { month: 'May', weight: 76 },
  { month: 'Jun', weight: 75 },
];

export function ProgressTracker() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Progress Tracker</CardTitle>
        <CardDescription>A sample of your weight journey over 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value} kg`}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))', opacity: '0.3' }}
                content={<ChartTooltipContent />}
              />
              <Line
                type="monotone"
                dataKey="weight"
                strokeWidth={2}
                stroke="hsl(var(--primary))"
                dot={{
                  r: 4,
                  fill: 'hsl(var(--primary))',
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
