'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const currentPage = pathname.split('/').pop() || 'dashboard';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <Sidebar
          user={user}
          onSignOut={signOut}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="flex-1 flex flex-col lg:ml-72">
          <header className="h-16 bg-white dark:bg-gray-800 px-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground capitalize pl-12 lg:pl-0">
              {currentPage}
            </h1>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <div className="container mx-auto px-6 py-8 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
