import { Metadata } from 'next';
import DirectoryContent from '~/components/DirectoryContent';
import { floridaCities } from '~/data/florida-cities';
import { directoryCache } from '~/lib/search-params';
import type { SearchParams } from 'nuqs/server';

interface Props {
  params: Promise<{
    city: string;
  }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const cityData = floridaCities.find((c) => c.slug === city);

  if (!cityData) {
    return {
      title: 'Lawn Care Services in Florida | Find Local Providers',
      description:
        'Find the best lawn care services in your city. Browse our directory of trusted lawn care professionals in Florida.',
      alternates: {
        canonical: '/lawn-care',
      },
    };
  }

  return {
    title: `Lawn Care Services in ${cityData.name}, FL | Find Local Providers`,
    description: `Find the best lawn care services in ${cityData.name}, Florida. Browse our directory of trusted lawn care professionals in ${cityData.name} and surrounding areas.`,
    alternates: {
      canonical: `/lawn-care/${city}`,
    },
  };
}

export default async function CityPage({ params, searchParams }: Props) {
  const { city } = await params;
  const cityData = floridaCities.find((c) => c.slug === city);

  // Parse search params server-side
  await directoryCache.parse(searchParams);

  return <DirectoryContent initialCity={cityData?.name} />;
}
