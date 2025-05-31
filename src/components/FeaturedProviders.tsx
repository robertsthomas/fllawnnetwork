'use client';

import { useQuery } from 'convex/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { useLocation } from '~/contexts/LocationContext';
import { getZipcodesInRadius } from '~/lib/location';
import { Provider } from '~/types';
import { api } from '~convex/_generated/api';
import ProviderCard from './ProviderCard';
import { Skeleton } from './ui/skeleton';

// Featured provider loading skeleton component
function FeaturedProvidersLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <Card className="border-none bg-transparent shadow-none">
        <CardHeader className="px-0 text-center">
          <Skeleton className="h-10 w-56 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto mt-2" />
        </CardHeader>
        <CardContent className="px-0">
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-20">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center gap-4">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex space-x-2">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Skeleton key={j} className="h-4 w-4" />
                      ))}
                    </div>
                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function FeaturedProviders() {
  const { location, isLoading: isLocationLoading } = useLocation();
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const providers = useQuery(api.providers.get) as Provider[] | undefined;
  const isProvidersLoading = providers === undefined;

  useEffect(() => {
    // Skip processing if providers data is empty
    if (!providers || providers.length === 0) {
      setFilteredProviders([]);
      return;
    }

    // Filter providers by the featured property
    const featuredProviders = providers.filter((provider) => provider.featured);

    // Only show providers if we have location info
    if (location?.postalCode && featuredProviders.length > 0) {
      const userPostalCode = location.postalCode;

      // Get all zip codes within 50 miles of user location
      const zipcodesInRadius = getZipcodesInRadius(userPostalCode, 50);

      // Filter providers by whether they're in the radius
      const filtered = featuredProviders.filter((provider) => {
        const providerPostalCode = provider.address?.postalCode;
        return providerPostalCode && zipcodesInRadius.includes(providerPostalCode);
      });
      // Only show providers in the radius
      setFilteredProviders(filtered);
    } else {
      // Debug info for no location case

      // If no location, show empty array
      setFilteredProviders([]);
    }
  }, [providers, location?.postalCode]);

  // Determine grid columns and max width based on number of providers
  const getGridClasses = () => {
    const count = filteredProviders.length;
    if (count === 1) return 'grid-cols-1 max-w-2xl mx-auto';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto';
  };

  const isLoading = isLocationLoading || isProvidersLoading;

  if (isLoading) {
    return (
      <div className="bg-white py-24 sm:py-32">
        <FeaturedProvidersLoading />
      </div>
    );
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Card className="border-none bg-transparent shadow-none">
          <CardHeader className="px-0 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Featured {filteredProviders.length === 1 ? 'Provider' : 'Providers'}
              {location && (
                <span className="text-primary-600">
                  {' '}
                  in {location.city}, {location.state}
                </span>
              )}
            </CardTitle>
            <CardDescription className="text-lg leading-8 text-gray-600">
              Discover top-rated lawn care{' '}
              {filteredProviders.length === 1 ? 'professional' : 'professionals'} in your area
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <div className={`mt-8 grid gap-x-8 gap-y-20 ${getGridClasses()}`}>
              {filteredProviders.length > 0 ? (
                filteredProviders
                  .slice(0, 3)
                  .map((provider) => (
                    <ProviderCard key={provider._id.toString()} provider={provider} />
                  ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">
                    We're working hard to find the best providers in your area.
                  </p>
                  <p className="text-gray-500 mt-2">
                    In the meantime, check out our full directory of trusted lawn care
                    professionals.
                  </p>
                  <Link
                    href="/lawn-care"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all providers →
                  </Link>
                </div>
              )}
            </div>
            <div className="mt-12 text-center">
              <Link
                href="/lawn-care"
                className="inline-flex items-center justify-center rounded-md bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                View Full Lawn Care Directory
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
