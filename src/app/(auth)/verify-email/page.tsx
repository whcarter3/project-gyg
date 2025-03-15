'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent you a verification link. Please check your
            email and click the link to verify your account.
          </p>
        </div>

        <div className="space-y-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">Return to login</Link>
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive the email?{' '}
            <Link
              href="/signup"
              className="text-primary underline-offset-4 hover:underline"
            >
              Try signing up again
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
