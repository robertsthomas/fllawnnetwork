'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProviders } from '@/lib/strapi';
import ProviderCard from './ProviderCard';
import { useLocation } from '@/contexts/LocationContext';
import { Provider } from '@/types';

interface FeaturedProvidersProps {
  providers: Provider[];
}

export default function FeaturedProviders({ providers }: FeaturedProvidersProps) {
  const { location, isLoading } = useLocation();
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);

  useEffect(() => {
    if (location) {
      // Filter providers by location
      const filtered = providers.filter(provider => 
        provider.address && provider.address.state === location.state
      );
      setFilteredProviders(filtered);
    } else {
      // If no location, show all featured providers
      setFilteredProviders(providers.filter(p => p.featured ?? false));
    }
  }, [providers, location]);

  // Determine grid columns and max width based on number of providers
  const getGridClasses = () => {
    const count = filteredProviders.length;
    if (count === 1) return 'grid-cols-1 max-w-2xl mx-auto';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto';
  };

  if (isLoading) {
    return (
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Loading featured providers...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Featured {filteredProviders.length === 1 ? 'Provider' : 'Providers'}
            {location && (
              <span className="text-primary-600"> in {location.city}, {location.state}</span>
            )}
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Discover top-rated lawn care {filteredProviders.length === 1 ? 'professional' : 'professionals'} in your area
          </p>
        </div>
        <div className={`mt-16 grid gap-x-8 gap-y-20 ${getGridClasses()}`}>
          {filteredProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      </div>
    </div>
  );
} 