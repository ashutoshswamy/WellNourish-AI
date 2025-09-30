import { Leaf } from 'lucide-react';

export function Header() {
  return (
    <header className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center gap-3">
        <Leaf className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
          WellNourish AI
        </h1>
      </div>
      <p className="mt-4 text-center text-lg text-muted-foreground">
        Your personal AI-powered diet and workout planner.
      </p>
    </header>
  );
}
