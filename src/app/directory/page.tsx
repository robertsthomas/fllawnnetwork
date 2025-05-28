import { Metadata } from 'next';
import { Suspense } from 'react';
import DirectoryContent from '~/components/DirectoryContent';
import DirectoryLoading from '~/components/DirectoryLoading';
import Hero from '~/components/Hero';
import MainLayout from '~/components/ui/MainLayout';

export const metadata: Metadata = {
  title: 'Lawn Care Services Near Me | Find Local Lawn Maintenance & Landscaping',
  description:
    'Search for lawn care services in your area. Find and compare local lawn maintenance companies, landscaping services, and garden care professionals. Read reviews, check ratings, and get free quotes from top-rated lawn care providers near you.',
  keywords:
    'lawn care services near me, local lawn maintenance, landscaping services near me, garden services, lawn mowing service, professional lawn care, local lawn service providers, lawn care directory, find lawn care, compare lawn services, lawn care reviews, lawn service quotes',
  openGraph: {
    title: 'Lawn Care Services Near Me | Find Local Lawn Maintenance & Landscaping',
    description:
      'Search for lawn care services in your area. Find and compare local lawn maintenance companies, landscaping services, and garden care professionals. Read reviews, check ratings, and get free quotes from top-rated lawn care providers near you.',
    type: 'website',
  },
};

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const city = (await searchParams).city as string;

  return (
    <main>
      {/* <Hero /> */}
      <DirectoryContent initialCity={city} />
    </main>
  );
}
