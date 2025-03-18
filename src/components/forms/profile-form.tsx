import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { updateProfile } from '@/app/actions/update-profile';
import { useToast } from '@/components/ui/use-toast';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Profile } from '@/types/database';
import type { User } from '@supabase/auth-helpers-nextjs';

export function ProfileForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  useEffect(() => {
    async function loadUserAndProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profile);
      }
    }
    loadUserAndProfile();
  }, [supabase]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const fullName = formData.get('fullName') as string;

    try {
      const { error: updateError } = await updateProfile(
        user.id,
        fullName
      );
      if (updateError) throw updateError;
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      // Refresh profile data
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(updatedProfile);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update profile'
      );
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
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
            name="fullName"
            type="text"
            defaultValue={profile?.full_name || ''}
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
