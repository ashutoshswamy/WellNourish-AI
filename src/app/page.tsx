'use client';

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  Salad, 
  Target, 
  Brain, 
  Heart,
  ChevronRight,
  Leaf,
  Utensils,
  Dumbbell,
  TrendingUp,
  Clock,
  Shield,
  Zap,
  Star,
  CheckCircle2,
  Users,
  Award,
  Calendar
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import Footer from "@/components/Footer";
import { HomePageSchema } from "@/components/JsonLd";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const features = [
  {
    icon: Brain,
    title: "AI-Powered Personalization",
    description: "Advanced algorithms analyze your preferences, goals, and dietary needs to create the perfect plan just for you.",
    gradient: "from-violet-500 to-purple-500"
  },
  {
    icon: Utensils,
    title: "Custom Meal Plans",
    description: "Get weekly meal plans with detailed recipes, nutritional info, and grocery lists tailored to your cuisine preferences.",
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    icon: Dumbbell,
    title: "Workout Routines",
    description: "Complementary exercise plans designed to work with your nutrition goals for maximum results.",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Monitor your journey with intuitive dashboards and celebrate milestones along the way.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Shield,
    title: "Allergy Safe",
    description: "We take allergies seriously. Every plan respects your dietary restrictions and sensitivities.",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    icon: Clock,
    title: "Time-Saving",
    description: "No more endless searching. Get complete plans in seconds, not hours.",
    gradient: "from-amber-500 to-yellow-500"
  }
];

const howItWorks = [
  {
    step: "01",
    title: "Tell Us About You",
    description: "Share your dietary preferences, allergies, fitness goals, and lifestyle in a quick 2-minute quiz.",
    icon: Users
  },
  {
    step: "02", 
    title: "AI Creates Your Plan",
    description: "Our advanced AI analyzes your profile and generates personalized meal and workout plans.",
    icon: Brain
  },
  {
    step: "03",
    title: "Start Your Journey",
    description: "Follow your customized plan with detailed recipes, instructions, and progress tracking.",
    icon: TrendingUp
  }
];

const stats = [
  { value: "10K+", label: "Meals Generated", icon: Utensils },
  { value: "95%", label: "User Satisfaction", icon: Heart },
  { value: "50+", label: "Cuisine Types", icon: Salad },
  { value: "24/7", label: "AI Available", icon: Zap }
];

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-background">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-full blur-[100px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Navigation */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b border-border/50 backdrop-blur-xl bg-background/70 sticky top-0 z-50"
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Leaf className="h-8 w-8 text-primary" />
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
            </motion.div>
            <span className="text-xl font-bold gradient-text">WellNourish AI</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted hover:text-foreground transition-colors">How It Works</a>
          </div>

          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-10 w-24 bg-border/50 rounded-xl animate-pulse" />
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                >
                  Dashboard
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <form action="/api/auth/signout" method="POST">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="text-sm font-medium px-4 py-2 rounded-xl bg-card border border-border hover:border-primary/50 transition-all"
                  >
                    Sign out
                  </motion.button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium hover:text-primary transition-colors hidden sm:block"
                >
                  Sign in
                </Link>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/signup"
                    className="text-sm font-medium px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                  >
                    Get Started Free
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </nav>
      </motion.header>

      <main className="flex-1">
        {/* Hero Section */}
        <section ref={heroRef} className="relative pt-12 pb-24 lg:pt-20 lg:pb-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              style={{ opacity, scale }}
              className="text-center max-w-5xl mx-auto"
            >
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-8"
              >
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Powered by Advanced AI</span>
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-xs font-semibold text-primary">NEW</span>
              </motion.div>

              {/* Heading */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
              >
                Transform Your Health With
                <span className="block mt-2">
                  <span className="gradient-text">AI-Powered</span> Nutrition
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg sm:text-xl text-muted max-w-3xl mx-auto mb-10 leading-relaxed"
              >
                Get personalized meal plans and workout routines crafted by AI in seconds. 
                Whether you want to lose weight, build muscle, or eat healthier—we've got you covered.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                {user ? (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all"
                    >
                      Go to Dashboard
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </motion.div>
                ) : (
                  <>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        href="/signup"
                        className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all"
                      >
                        Start Free — No Credit Card
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        href="#how-it-works"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-2xl border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                      >
                        See How It Works
                      </Link>
                    </motion.div>
                  </>
                )}
              </motion.div>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {['bg-primary', 'bg-secondary', 'bg-accent', 'bg-pink-500'].map((color, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full ${color} border-2 border-background flex items-center justify-center text-white text-xs font-bold`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <span>Joined by <strong className="text-foreground">2,000+</strong> users</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1"><strong className="text-foreground">4.9/5</strong> rating</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-16 lg:mt-24 relative max-w-5xl mx-auto"
            >
              <div className="relative bg-gradient-to-b from-card to-card/50 rounded-3xl border border-border shadow-2xl shadow-primary/10 overflow-hidden">
                {/* Browser mockup header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card/80">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 rounded-lg bg-background/50 text-xs text-muted">wellnourishai.in/dashboard</div>
                  </div>
                </div>
                
                {/* Dashboard Preview */}
                <div className="p-6 lg:p-8">
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Card */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-primary/20">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Your Weekly Plan</h3>
                          <p className="text-sm text-muted">Personalized for you</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                          <div key={i} className={`p-3 rounded-xl text-center ${i === 0 ? 'bg-primary text-white' : 'bg-card/50'}`}>
                            <span className="text-xs font-medium">{day}</span>
                            <div className={`mt-1 h-1 rounded-full ${i < 3 ? 'bg-primary' : i === 0 ? 'bg-white/30' : 'bg-border'}`} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="space-y-4">
                      <div className="bg-card rounded-2xl p-4 border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted">Daily Calories</span>
                          <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-2xl font-bold">2,150</p>
                        <div className="mt-2 h-2 rounded-full bg-border overflow-hidden">
                          <div className="h-full w-3/4 bg-gradient-to-r from-primary to-secondary rounded-full" />
                        </div>
                      </div>
                      <div className="bg-card rounded-2xl p-4 border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted">Protein Goal</span>
                          <Target className="h-4 w-4 text-secondary" />
                        </div>
                        <p className="text-2xl font-bold">125g</p>
                        <p className="text-xs text-primary mt-1">On track! +12% from last week</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-8 top-1/4 hidden lg:block"
              >
                <div className="bg-card rounded-2xl p-4 border border-border shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-green-500/10">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Breakfast Ready!</p>
                      <p className="text-xs text-muted">Greek Yogurt Bowl</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-8 bottom-1/4 hidden lg:block"
              >
                <div className="bg-card rounded-2xl p-4 border border-border shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Dumbbell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Workout Complete</p>
                      <p className="text-xs text-muted">45 min • 320 cal burned</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-border bg-card/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-4">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-3xl lg:text-4xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-sm text-muted mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">Features</span>
              <h2 className="text-3xl lg:text-5xl font-bold mb-4">Everything You Need to <span className="gradient-text">Succeed</span></h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                Powerful features designed to make your wellness journey effortless and enjoyable.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative p-6 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 relative">{feature.title}</h3>
                  <p className="text-muted relative leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-gradient-to-b from-card/50 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">How It Works</span>
              <h2 className="text-3xl lg:text-5xl font-bold mb-4">Get Started in <span className="gradient-text">3 Simple Steps</span></h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                From signup to your first personalized plan in under 5 minutes.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8 relative">
              {/* Connection line */}
              <div className="absolute top-24 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent hidden lg:block" />
              
              {howItWorks.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative text-center"
                >
                  <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl shadow-primary/30">
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">Step {step.step}</span>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted max-w-xs mx-auto">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[2.5rem] bg-gradient-to-br from-primary via-primary-dark to-secondary p-12 lg:p-20 text-center overflow-hidden"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              </div>
              
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8"
                >
                  <Award className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">Start Your Transformation Today</span>
                </motion.div>

                <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                  Ready to Transform<br />Your Health?
                </h2>
                <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
                  Join thousands of users who have already transformed their health with personalized AI-powered nutrition plans.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/signup"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-2xl bg-white text-primary shadow-2xl hover:bg-white/90 transition-all"
                    >
                      Get Started Free
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </motion.div>
                </div>

                <p className="text-sm text-white/60 mt-6">
                  No credit card required • Free forever plan available
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* JSON-LD Structured Data */}
      <HomePageSchema />
    </div>
  );
}
