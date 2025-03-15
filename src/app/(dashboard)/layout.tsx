'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/dashboard/sidebar';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-screen bg-background">
      <header className="fixed top-0 w-full border-b z-50 bg-background">
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold text-primary">GYG</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>
            <Button variant="outline" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <div className="flex pt-16 h-full">
        <aside className="hidden md:flex w-72 shrink-0 border-r h-full">
          <Sidebar />
        </aside>
        <main className="flex-1 overflow-y-auto">
          <div className="container py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
