'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { db } from '@/lib/supabase/db';
import { createProfile } from '@/app/actions/create-profile';
import { updateProfile } from '@/app/actions/update-profile';
import type { Profile } from '@/types/database';

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');

  // Function to load profile
  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        console.log('No authenticated user found');
        setError('Please log in to view your profile');
        return;
      }

      console.log('Loading profile for user:', user.id);

      // Try to get the profile
      const { data: existingProfile, error: fetchError } = await db
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        console.log('Fetch error:', fetchError);

        // If profile doesn't exist, create one using server action
        if (fetchError.code === 'PGRST116') {
          console.log('No profile found, creating new profile...');

          const { data: newProfile, error: createError } =
            await createProfile(user.id);

          if (createError) {
            console.error('Error creating profile:', createError);
            throw createError;
          }

          if (!newProfile) {
            throw new Error('Failed to create profile');
          }

          console.log('New profile created:', newProfile);
          setProfile(newProfile);
          setFullName(newProfile.full_name || '');
          return;
        }
        throw fetchError;
      }

      console.log('Existing profile found:', existingProfile);
      setProfile(existingProfile);
      setFullName(existingProfile.full_name || '');
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      loadProfile();
    }
  }, [user, authLoading, loadProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSaving(true);
      setError(null);

      const { data: updatedProfile, error: updateError } =
        await updateProfile(user.id, fullName);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw updateError;
      }

      if (!updatedProfile) {
        throw new Error('Failed to update profile');
      }

      setProfile(updatedProfile);

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className =
        'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md';
      successMessage.textContent = 'Profile updated successfully';
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          Please log in to view your profile
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your profile information
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={user?.email || ''}
            disabled
            className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="fullName"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter your full name"
          />
        </div>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save changes'}
        </Button>
      </form>

      <div className="text-sm text-muted-foreground">
        Last updated:{' '}
        {profile?.updated_at
          ? new Date(profile.updated_at).toLocaleString()
          : 'Never'}
      </div>
    </div>
  );
}
