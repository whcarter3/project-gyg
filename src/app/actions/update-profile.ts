'use server';

import { adminDb } from '@/lib/supabase/admin-db';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function updateProfile(
  userId: string,
  fullName: string
) {
  try {
    // Verify the user is authenticated and updating their own profile
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== userId) {
      throw new Error('Unauthorized');
    }

    // Update the profile using admin client
    const { data, error } = await adminDb
      .from('profiles')
      .upsert(
        {
          id: userId,
          full_name: fullName,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'id',
        }
      )
      .select('*')
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { data: null, error };
  }
}
