import { Metadata } from 'next';
import DirectoryContent from '~/components/DirectoryContent';
import { floridaCities } from '~/data/florida-cities';

interface Props {
  params: Promise<{
    city: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const cityData = floridaCities.find((c) => c.slug === city);

  if (!cityData) {
    return {
      title: 'Lawn Care Services in Florida | Find Local Providers',
      description:
        'Find the best lawn care services in your city. Browse our directory of trusted lawn care professionals in Florida.',
    };
  }

  return {
    title: `Lawn Care Services in ${cityData.name}, FL | Find Local Providers`,
    description: `Find the best lawn care services in ${cityData.name}, Florida. Browse our directory of trusted lawn care professionals in ${cityData.name} and surrounding areas.`,
  };
}

export default async function CityPage({ params }: Props) {
  const { city } = await params;
  const cityData = floridaCities.find((c) => c.slug === city);

  return <DirectoryContent initialCity={cityData?.name} />;
}
