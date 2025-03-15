import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Skip middleware for auth callback route
  if (request.nextUrl.pathname.startsWith('/auth/callback')) {
    return NextResponse.next();
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(
          name: string,
          value: string,
          options: {
            path: string;
            sameSite: 'lax' | 'strict' | 'none';
            domain?: string;
            secure?: boolean;
          }
        ) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: { path: string }) {
          response.cookies.delete({
            name,
            ...options,
          });
        },
      },
    }
  );

  // Refresh session if expired - this will set new cookies
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Handle protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Handle auth routes
  if (['/login', '/signup'].includes(request.nextUrl.pathname)) {
    if (session) {
      return NextResponse.redirect(
        new URL('/dashboard', request.url)
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
