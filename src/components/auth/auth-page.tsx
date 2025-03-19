'use client';

import { cn } from '@/lib/utils';

interface AuthPageProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthPage({ children, className }: AuthPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div
        className={cn(
          'w-full max-w-md space-y-8 rounded-lg border bg-card p-6 shadow-sm',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
