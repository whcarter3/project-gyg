import { handleYahooCallback } from '@/lib/yahoo/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(
        new URL('/dashboard?error=no_code', request.url)
      );
    }

    await handleYahooCallback(code);
    return NextResponse.redirect(
      new URL('/dashboard?success=connected', request.url)
    );
  } catch (error) {
    console.error('Error handling Yahoo callback:', error);
    return NextResponse.redirect(
      new URL('/dashboard?error=auth_failed', request.url)
    );
  }
}
