import createMiddleware from 'next-intl/middleware';
import { updateSession } from '@/lib/supabase/middleware';
import { type NextRequest } from 'next/server';
import { locales } from './i18n';

// Create the internationalization middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: false, // Disable automatic locale detection
});

export async function middleware(request: NextRequest) {
  console.log('Middleware called for:', request.nextUrl.pathname);

  // Handle internationalization first
  const intlResponse = intlMiddleware(request);

  console.log('Intl response status:', intlResponse.status);

  // If intl middleware returns a redirect, use it
  if (intlResponse.status !== 200) {
    return intlResponse;
  }

  // Apply Supabase session middleware
  const sessionResponse = await updateSession(request);
  console.log('Session response status:', sessionResponse.status);

  return sessionResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
