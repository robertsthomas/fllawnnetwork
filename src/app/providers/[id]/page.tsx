import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MainLayout from '~/components/ui/MainLayout';
import { Suspense } from 'react';
import ProviderDetailContent from '~/components/ProviderDetailContent';
import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { Id } from '../../../../convex/_generated/dataModel';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: 'Provider Details - Lawn Care Directory',
    description: 'View details and contact information for this lawn care provider.',
  };
}

export default async function ProviderDetailPage({
  params,
}: {
  params: Promise<{ id: Id<"providers"> }>;
}) {
  const { id } = await params;
  return (
    <MainLayout>
      <Suspense fallback={<div>Loading provider details...</div>}>
        <ProviderDetailContent id={id} />
      </Suspense>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Business Owner?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            If this is your business, claim your listing to update information, respond to reviews, and more.
          </p>
          <Button asChild className="px-6">
            <Link href={`/claim-business/${id}`}>
              Claim This Business
            </Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
} 