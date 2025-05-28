import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // // Only apply HTTPS and www redirects in production
  // if (process.env.NODE_ENV === 'production') {
  //   // Handle www to non-www and http to https redirects
  //   if (url.hostname.startsWith('www.') || url.protocol === 'http:') {
  //     url.hostname = url.hostname.replace(/^www\./, '');
  //     url.protocol = 'https:';
  //     return NextResponse.redirect(url, {
  //       status: 301, // Permanent redirect
  //     });
  //   }
  // }

  // // Remove trailing slash except for root path
  // if (url.pathname !== '/' && url.pathname.endsWith('/')) {
  //   url.pathname = url.pathname.slice(0, -1);
  //   return NextResponse.redirect(url, {
  //     status: 301, // Permanent redirect
  //   });
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 