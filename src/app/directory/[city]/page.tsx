import { Metadata } from 'next';
import { Suspense } from 'react';
import DirectoryContent from '~/components/DirectoryContent';
import DirectoryLoading from '~/components/DirectoryLoading';
import MainLayout from '~/components/ui/MainLayout';

export const metadata: Metadata = {
  title: 'Lawn Care Services | Find Local Lawn Maintenance & Landscaping',
  description:
    'Search for lawn care services in your area. Find and compare local lawn maintenance companies, landscaping services, and garden care professionals.',
};

export default async function CityDirectoryPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  return (
    <MainLayout>
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              {/* Filter sidebar placeholder */}
              <div className="hidden lg:block lg:col-span-3">
                <div className="sticky top-24">{/* Skeleton for filters */}</div>
              </div>

              {/* Main content loading state */}
              <div className="mt-8 lg:mt-0 lg:col-span-9">
                <DirectoryLoading />
              </div>
            </div>
          </div>
        }
      >
        <DirectoryContent initialCity={city} />
      </Suspense>
    </MainLayout>
  );
}
