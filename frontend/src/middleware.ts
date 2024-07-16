import { createServerClient } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { pathStartsWith } from './lib/PathHelper';

const handleRedirection = (user: User | null, request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // Redirect logged-in users away from auth routes, except signout and update_password
  if (
    user &&
    pathStartsWith(pathname, '/auth') &&
    !pathStartsWith(pathname, '/auth/signout', '/auth/update_password')
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect non-logged-in users away from update_password and signout routes
  // and from any route except home and auth routes
  if (
    !user &&
    (pathStartsWith(pathname, '/auth/update_password', '/auth/signout') ||
      (pathname !== '/' && !pathStartsWith(pathname, '/auth')))
  ) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return null;
};

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  request.headers.set('x-url', request.url);
  request.headers.set('x-origin', origin);
  request.headers.set('x-pathname', pathname);
  request.headers.set('x-referrer', request.referrer);

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const redirection = handleRedirection(user, request);

  if (redirection) {
    return redirection;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public directory files)
     * - api (API routes)
     * - error (Error routes)
     * - user view route
     * - styles (CSS files)
     * - scripts (JavaScript files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|error|user/:id|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)',
  ],
};
