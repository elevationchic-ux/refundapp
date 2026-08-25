import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

// Country to locale mapping based on GeoIP detection
const COUNTRY_TO_LOCALE_MAP: Record<string, string> = {
  // Europe - French
  FR: 'fr',
  BE: 'fr',
  CH: 'fr',
  LU: 'fr',
  MC: 'fr',
  
  // Europe - Spanish
  ES: 'es',
  AR: 'es',
  MX: 'es',
  CO: 'es',
  CL: 'es',
  PE: 'es',
  VE: 'es',
  
  // Europe - German
  DE: 'de',
  AT: 'de',
  
  // North America - English
  US: 'en-US',
  
  // Canada
  CA: 'en-CA', // Default to English for Canada, can be overridden by Accept-Language
  
  // UK
  GB: 'en-GB',
  IE: 'en-GB',
  
  // Other English-speaking countries default to US English
  AU: 'en-US',
  NZ: 'en-US',
  IN: 'en-US',
  SG: 'en-US',
};

function detectLocaleFromHeaders(request: NextRequest): string | null {
  // 1. Check for existing locale cookie (user preference)
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
  if (localeCookie) {
    return localeCookie;
  }

  // 2. Try GeoIP detection via headers (Vercel, Cloudflare, or other CDN)
  const country = 
    request.headers.get('x-vercel-ip-country') || // Vercel
    request.headers.get('cf-ipcountry') || // Cloudflare
    request.headers.get('x-country-code') || // Generic
    null;
  
  if (country && COUNTRY_TO_LOCALE_MAP[country]) {
    // Special handling for Canada: check Accept-Language for French preference
    if (country === 'CA') {
      const acceptLanguage = request.headers.get('accept-language') || '';
      if (acceptLanguage.includes('fr')) {
        return 'fr-CA';
      }
    }
    return COUNTRY_TO_LOCALE_MAP[country];
  }

  // 3. Fallback to Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || '';
  
  if (acceptLanguage.includes('fr')) return 'fr';
  if (acceptLanguage.includes('es')) return 'es';
  if (acceptLanguage.includes('de')) return 'de';
  if (acceptLanguage.includes('en-CA')) return 'en-CA';
  if (acceptLanguage.includes('en-GB')) return 'en-GB';
  if (acceptLanguage.includes('en')) return 'en-US';

  // 4. Default fallback
  return null; // Let next-intl handle default
}

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, etc.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.match(/\.[^/]+$/)
  ) {
    return NextResponse.next();
  }

  // Detect if user is on root path without locale
  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If no locale in path, detect and redirect
  if (!pathnameHasLocale && pathname === '/') {
    const detectedLocale = detectLocaleFromHeaders(request);
    
    if (detectedLocale && routing.locales.includes(detectedLocale as any)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${detectedLocale}`;
      
      const response = NextResponse.redirect(url);
      // Set cookie to remember user's locale preference
      response.cookies.set('NEXT_LOCALE', detectedLocale, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      });
      return response;
    }
  }

  // Let next-intl middleware handle the rest
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
