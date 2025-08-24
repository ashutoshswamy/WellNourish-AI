import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse, Dumbbell, Salad } from 'lucide-react';
import { Logo } from '@/components/Logo';
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold font-headline text-foreground">
            WellNourish AI
          </span>
        </Link>
        <nav>
          <Button asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold font-headline text-foreground">
              Transform Your Health with AI-Powered Wellness
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              WellNourish AI crafts personalized diet and workout plans that adapt to your unique body, lifestyle, and goals. Stop guessing, start thriving.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/login">Create Your Personalized Plan</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-background/80 py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">A Smarter Path to Wellness</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">Our intelligent platform analyzes your unique profile to deliver plans that truly work for you.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Card className="bg-transparent border-0 shadow-none">
                        <CardHeader className="flex flex-col items-center text-center">
                            <div className="p-4 bg-primary/10 rounded-full mb-4">
                               <Salad className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="font-headline text-2xl">Personalized Diet Plans</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center text-muted-foreground">
                            Receive delicious, easy-to-follow meal plans designed by our AI to meet your specific nutritional needs and dietary preferences.
                        </CardContent>
                    </Card>
                    <Card className="bg-transparent border-0 shadow-none">
                        <CardHeader className="flex flex-col items-center text-center">
                            <div className="p-4 bg-primary/10 rounded-full mb-4">
                               <Dumbbell className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="font-headline text-2xl">Custom Workout Plans</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center text-muted-foreground">
                            Get effective workout routines tailored to your fitness level, goals, and available equipment, from home bodyweight exercises to full gym sessions.
                        </CardContent>
                    </Card>
                    <Card className="bg-transparent border-0 shadow-none">
                        <CardHeader className="flex flex-col items-center text-center">
                            <div className="p-4 bg-primary/10 rounded-full mb-4">
                               <HeartPulse className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="font-headline text-2xl">Progress Tracking</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center text-muted-foreground">
                            Monitor your journey with intuitive charts and visualizations. See how far you've come and stay motivated to reach your goals.
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Image src="https://placehold.co/600x400.png" alt="Healthy food" width={600} height={400} className="rounded-lg shadow-xl" data-ai-hint="healthy food" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Nourish Your Body, Fuel Your Life.</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our AI considers everything from your medical history to your taste in food to create a diet that's not just healthy, but also enjoyable. Say goodbye to restrictive, one-size-fits-all diets.
              </p>
              <Button asChild size="lg" className="mt-6">
                <Link href="/login">Find Your Perfect Diet</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} WellNourish AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
