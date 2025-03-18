'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[66vh] flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-secondary">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-background">
                Get Your Guys
              </h1>
              <p className="mx-auto max-w-[700px] text-background/90 md:text-xl">
                Your all-in-one platform for managing fantasy sports
                leagues, tracking stats, and competing with friends.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-background text-primary hover:bg-background/90"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-background border-2 border-background hover:bg-background/10"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Real-time Stats
              </h3>
              <p className="text-primary">
                Track your fantasy team&apos;s performance with live
                updates and detailed statistics.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">
                League Management
              </h3>
              <p className="text-primary">
                Create and manage your fantasy leagues with ease,
                including drafts and trades.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Smart Predictions
              </h3>
              <p className="text-primary">
                Get AI-powered insights and predictions to help you
                make better decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Get Started?
              </h2>
              <p className="mx-auto max-w-[600px] text-background/90 md:text-xl">
                Join thousands of fantasy sports enthusiasts who are
                already using Get Your Guys.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/login">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-background text-primary hover:bg-background/90"
                >
                  Sign Up Now
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-background border-2 border-background hover:bg-background/10"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Toggle */}
      <ThemeToggle />
    </div>
  );
}
