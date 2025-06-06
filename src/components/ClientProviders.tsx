'use client';

import ConvexClientProvider from '~/providers/ConvexClientProvider';
import { ProviderAuthProvider } from '~/contexts/ProviderAuthContext';
import { AdminAuthProvider } from '~/contexts/AdminAuthContext';
import { PostHogProvider } from 'posthog-js/react';
import { QueryProvider } from '~/components/QueryProvider';
import { LocationProvider } from '~/contexts/LocationContext';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ConvexClientProvider>
      <ProviderAuthProvider>
        <AdminAuthProvider>
          <PostHogProvider apiKey={process.env.NEXT_PUBLIC_POSTHOG_KEY!}>
            <QueryProvider>
              <LocationProvider>
                {children}
              </LocationProvider>
            </QueryProvider>
          </PostHogProvider>
        </AdminAuthProvider>
      </ProviderAuthProvider>
    </ConvexClientProvider>
  );
} 