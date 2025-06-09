import { Metadata } from 'next';
import { Id } from '../../../../../convex/_generated/dataModel';
import { api } from '../../../../../convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';
import ProviderDashboardClient from './ProviderDashboardClient';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const provider = await convex.query(api.providers.getProviderById, { id: params.id as Id<'providers'> });
  
  if (!provider) {
    return {
      title: 'Provider Dashboard - Lawn Care Directory',
      description: 'Manage your lawn care business listing and track performance.',
    };
  }

  return {
    title: `${provider.title} - Provider Dashboard`,
    description: `Analytics and management dashboard for ${provider.title}`,
  };
}

export default function ProviderDashboardPage({
  params,
}: {
  params: { id: Id<'providers'> };
}) {
  return <ProviderDashboardClient params={params} />;
} 