'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { supabase } from '@/lib/supabase/client';
import { createProfile } from '@/app/actions/create-profile';
import { updateProfile } from '@/app/actions/update-profile';
import type { Profile } from '@/types/database';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

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
      const { data: existingProfile, error: fetchError } =
        await supabase
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
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!user || !e.target.files || !e.target.files[0]) return;

    try {
      setIsUploading(true);
      setError(null);

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath);

      // Update the profile with the new avatar URL
      const { data: updatedProfile, error: updateError } =
        await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', user.id)
          .select()
          .single();

      if (updateError) throw updateError;
      if (!updatedProfile)
        throw new Error('Failed to update profile');

      setProfile(updatedProfile);
      toast({
        title: 'Avatar updated',
        description:
          'Your profile picture has been updated successfully.',
      });
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError('Failed to upload avatar');
      toast({
        title: 'Error',
        description: 'Failed to upload avatar. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
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
    <div className="space-y-8">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex items-center space-x-6">
        <div className="relative">
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.full_name || 'Profile picture'}
              width={128}
              height={128}
              className="rounded-full"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {profile?.full_name
                  ? profile.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                  : '?'}
              </span>
            </div>
          )}
          <div className="absolute bottom-0 right-0">
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer bg-primary rounded-full p-2 shadow-md hover:bg-primary/90 transition-colors flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-background"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={isUploading}
            />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {profile?.full_name || 'No name set'}
          </h2>
          <p className="text-primary">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none text-foreground"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={user?.email || ''}
            disabled
            className="flex h-10 w-full rounded-md border border-muted-foreground bg-background px-3 py-2 text-sm text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="fullName"
            className="text-sm font-medium leading-none text-foreground"
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="flex h-10 w-full rounded-md border border-muted-foreground bg-background px-3 py-2 text-sm text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter your full name"
          />
        </div>

        <Button
          type="submit"
          disabled={isSaving}
          className="bg-primary text-background hover:bg-primary/90"
        >
          {isSaving ? 'Saving...' : 'Save changes'}
        </Button>
      </form>

      <div className="text-sm text-primary">
        Last updated:{' '}
        {profile?.updated_at
          ? new Date(profile.updated_at).toLocaleString()
          : 'Never'}
      </div>
    </div>
  );
}
