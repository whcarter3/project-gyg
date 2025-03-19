'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Avatar } from '@/components/ui/avatar';
import type { Profile } from '@/types/database';
import type { User } from '@supabase/supabase-js';

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadProfile = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUser(user);
    setDisplayName(user.user_metadata.display_name || '');
    setEmail(user.email || '');

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error loading profile:', error);
      return;
    }

    setProfile(profile);
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);

    try {
      // Update display name in user metadata
      const { error: displayNameError } =
        await supabase.auth.updateUser({
          data: { display_name: displayName },
        });

      if (displayNameError) throw displayNameError;

      // Update email if changed and not a Google user
      if (
        email !== user.email &&
        user.app_metadata.provider !== 'google'
      ) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: email,
        });

        if (emailError) throw emailError;
      }

      // Refresh user data to update the UI
      await loadProfile();

      toast({
        title: 'Profile updated',
        description:
          email !== user.email
            ? 'Check your email to confirm the email change.'
            : 'Your profile has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const isGoogleUser = user.app_metadata.provider === 'google';

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center space-x-4 mb-8">
        <Avatar
          user={user}
          profile={profile}
          size="lg"
          showUploadButton
        />
        <div>
          <h1 className="text-2xl font-bold">
            {user.user_metadata.display_name || 'No name set'}
          </h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDisplayName(e.target.value)
            }
            placeholder="Enter your display name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            disabled={isGoogleUser}
            placeholder="Enter your email address"
          />
          {isGoogleUser && (
            <p className="text-sm text-muted-foreground">
              Email cannot be changed for Google accounts
            </p>
          )}
        </div>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
}
