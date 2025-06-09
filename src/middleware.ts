import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/lawn-care(.*)',
  '/providers(.*)',
  '/services(.*)',
  '/blog(.*)',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
  '/cookies',
  '/api/providers(.*)',
  '/api/contact(.*)',
  '/api/claim-business',
  '/admin/setup', // Allow access to initial admin setup
  '/admin/login(.*)', // Allow access to admin login page
  '/admin/signout', // Allow access to admin signout page
]);

// Define admin routes that require admin authentication
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // First check if it's a public route - if so, don't protect it
  if (isPublicRoute(req)) {
    return;
  }

  // All other routes require authentication
  await auth.protect();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (static images from public/images)
     * - static files from public directory (logo.png, ads.txt, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|logo.png|ads.txt|favicon.svg).*)',
  ],
}; 