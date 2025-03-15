'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Auth callback: Starting session check');

        // First try to get the code from URL
        const code = searchParams.get('code');
        console.log('Auth callback: Code from URL:', code);

        if (!code) {
          console.log(
            'Auth callback: No code in URL, checking session'
          );
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session) {
            console.log(
              'Auth callback: Found existing session, redirecting to dashboard'
            );
            router.replace('/dashboard');
            return;
          }

          console.log(
            'Auth callback: No session found, redirecting to login'
          );
          router.replace('/login');
          return;
        }

        // Set up auth state change listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          console.log('Auth callback: Auth state change:', {
            event,
            hasSession: !!session,
          });

          if (event === 'SIGNED_IN' && session) {
            console.log(
              'Auth callback: SIGNED_IN event, redirecting to dashboard'
            );
            router.replace('/dashboard');
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error in auth callback:', error);
        router.replace('/login');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
