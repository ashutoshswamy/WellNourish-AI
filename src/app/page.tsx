import { Header } from '@/components/header';
import { WellnessDashboard } from '@/components/wellness-dashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <WellnessDashboard />
    </main>
  );
}
