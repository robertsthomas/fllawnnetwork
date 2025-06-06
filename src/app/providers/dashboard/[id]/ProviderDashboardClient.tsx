'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProviderAnalyticsDashboard from '~/components/providers/ProviderAnalyticsDashboard';
import MainLayout from '~/components/ui/MainLayout';
import { useProviderAuth } from '~/contexts/ProviderAuthContext';
import { Id } from '../../../../../convex/_generated/dataModel';

interface ProviderDashboardClientProps {
  params: { id: Id<'providers'> };
}

export default function ProviderDashboardClient({ params }: ProviderDashboardClientProps) {
  const { isAuthenticated, provider } = useProviderAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/providers/login');
    } else if (provider && provider._id !== params.id) {
      // If the provider is authenticated but trying to access a different provider's dashboard
      router.push(`/providers/dashboard/${provider._id}`);
    }
  }, [isAuthenticated, provider, params.id, router]);

  if (!isAuthenticated || !provider) {
    return null; // Will redirect in useEffect
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back, {provider.title}
            </p>
          </div>
          <Suspense fallback={<div>Loading dashboard...</div>}>
            <ProviderAnalyticsDashboard providerId={params.id} />
          </Suspense>
        </div>
      </div>
    </MainLayout>
  );
} 