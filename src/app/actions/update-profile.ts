'use server';

export const runtime = 'edge';

import { adminDb } from '@/lib/supabase/admin-db';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type {
  Profile,
  DatabaseResponse,
  DatabaseError,
} from '@/types/database';

export async function updateProfile(
  userId: string,
  fullName: string
): Promise<DatabaseResponse<Profile>> {
  try {
    // Create a Supabase client for auth
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

    if (!user || user.id !== userId) {
      return {
        data: null,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Unauthorized',
          details: null,
          hint: null,
        },
      };
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

    if (error) {
      return { data: null, error: error as DatabaseError };
    }

    return { data: data as Profile, error: null };
  } catch (error) {
    console.error('Error updating profile:', error);
    return {
      data: null,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : null,
        hint: null,
      },
    };
  }
}
