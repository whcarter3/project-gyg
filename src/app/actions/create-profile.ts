'use server';

import { adminDb } from '@/lib/supabase/admin-db';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function getDefaultAvatarUrl(name: string): string {
  const initials = getInitials(name);
  const colors = [
    'bg-primary',
    'bg-secondary',
    'bg-accent',
    'bg-destructive',
    'bg-muted',
  ];
  const randomColor =
    colors[Math.floor(Math.random() * colors.length)];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials
  )}&background=${randomColor.replace('bg-', '')}&color=fff&size=128`;
}

export async function createProfile(userId: string) {
  try {
    // Get user metadata to access full_name
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value ?? '';
          },
          set(name, value) {
            cookieStore.set(name, value);
          },
          remove(name) {
            cookieStore.delete(name);
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not found');

    // Get the user's name from either user metadata or Google profile
    let fullName = user.user_metadata.full_name;

    // If no full_name in metadata but this is a Google user, use their name
    if (!fullName && user.app_metadata.provider === 'google') {
      fullName = user.user_metadata.name;
    }

    // Get avatar URL from Google profile or generate a default one
    let avatarUrl = user.user_metadata.avatar_url;
    if (!avatarUrl && fullName) {
      avatarUrl = getDefaultAvatarUrl(fullName);
    }

    // First try to upsert
    const { data: upsertData, error: upsertError } = await adminDb
      .from('profiles')
      .upsert(
        {
          id: userId,
          full_name: fullName || null,
          avatar_url: avatarUrl || null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'id',
          ignoreDuplicates: true,
        }
      )
      .select()
      .single();

    // If upsert succeeded, return the data
    if (!upsertError && upsertData) {
      return { data: upsertData, error: null };
    }

    // If no data was returned (because it already existed), fetch the existing profile
    const { data: existingProfile, error: fetchError } = await adminDb
      .from('profiles')
      .select()
      .eq('id', userId)
      .single();

    if (fetchError) throw fetchError;
    if (!existingProfile)
      throw new Error('Failed to create or fetch profile');

    return { data: existingProfile, error: null };
  } catch (error) {
    console.error('Error creating profile:', error);
    return { data: null, error };
  }
}
