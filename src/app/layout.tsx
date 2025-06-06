import ClientProviders from '~/components/ClientProviders';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Header from '~/components/Header';
import Footer from '~/components/Footer';
import './globals.css';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Florida Lawn Network - Find Local Lawn Care Services',
  description:
    'Find and compare local lawn care services in Florida. Get quotes from trusted providers for mowing, landscaping, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" className="h-full bg-gray-50">
        <head>
          <link rel="canonical" href="https://www.fllawnnetwork.com/" />
        </head>
        <body>
          <NuqsAdapter>
            <ClientProviders>
              <Header />
              <div className="pt-16">{children}</div>
              <SpeedInsights />
              <Footer />
            </ClientProviders>
          </NuqsAdapter>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
