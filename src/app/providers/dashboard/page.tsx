'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useConvexAuth } from 'convex/react';
import { useProviderAuth } from '~/contexts/ProviderAuthContext';
import MainLayout from '~/components/ui/MainLayout';

export default function ProviderDashboardPage() {
  const { isLoading } = useConvexAuth();
  const { isAuthenticated, provider } = useProviderAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.push('/providers/login');
      } else if (provider) {
        // Redirect to the specific provider dashboard
        router.push(`/providers/dashboard/${provider._id}`);
      } else {
        // Authenticated but no provider found, redirect to registration
        router.push('/providers/register');
      }
    }
  }, [isAuthenticated, provider, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // This will only show briefly before redirect
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your dashboard...</p>
        </div>
      </div>
    </MainLayout>
  );
} 