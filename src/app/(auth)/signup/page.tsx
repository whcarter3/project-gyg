'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { GoogleButton } from '@/components/ui/google-button';
import { PasswordRequirements } from '@/components/ui/password-requirements';
import { validatePassword } from '@/lib/utils/password-validation';
import { AuthPage } from '@/components/auth/auth-page';
import { AuthHeader } from '@/components/auth/auth-header';
import { AuthDivider } from '@/components/auth/auth-divider';

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteractedWithPassword, setHasInteractedWithPassword] =
    useState(false);

  const passwordValidation = validatePassword(password);
  const canSubmit =
    email.length > 0 &&
    password.length > 0 &&
    displayName.length > 0 &&
    passwordValidation.isValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (error) {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
        console.error('Error signing up:', error);
        return;
      }

      toast({
        title: 'Check your email',
        description:
          'We sent you a confirmation link to complete your registration.',
      });
      router.push('/login');
    } catch (error) {
      console.error('Error signing up:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPage>
      <AuthHeader
        title="Create an account"
        description="Enter your details below to create your account"
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            placeholder="Enter your display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (!hasInteractedWithPassword) {
                setHasInteractedWithPassword(true);
              }
            }}
            required
          />
          {hasInteractedWithPassword && (
            <PasswordRequirements validation={passwordValidation} />
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!canSubmit || isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <AuthDivider />

      <GoogleButton />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthPage>
  );
}
