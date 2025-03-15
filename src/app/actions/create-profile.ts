'use server';

import { adminDb } from '@/lib/supabase/admin-db';

export async function createProfile(userId: string) {
  try {
    // First try to upsert
    const { data: upsertData, error: upsertError } = await adminDb
      .from('profiles')
      .upsert(
        {
          id: userId,
          full_name: null,
          avatar_url: null,
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
