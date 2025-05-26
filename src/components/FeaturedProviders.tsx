'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProviderCard from './ProviderCard';
import { useLocation } from '@/contexts/LocationContext';
import { LawnCareProvider } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import zipcodes from 'zipcodes';
import { useProviders } from '@/hooks/useProviders';
import { isProviderFeatured } from '@/lib/apify';

// Define featured provider IDs
const FEATURED_PLACE_IDS = [
  'ChIJhVYnKvzE2YgR3lmo3jABNLw',
  'ChIJi0Op4CKn2YgRGEq_PI5EgIU',
  'ChIJ33-tZVGh2YgRSiunrdwtLmk',
];

export default function FeaturedProviders() {
  const { location, isLoading: isLocationLoading } = useLocation();
  const { data: providers = [], isLoading: isProvidersLoading } = useProviders();
  const [filteredProviders, setFilteredProviders] = useState<LawnCareProvider[]>([]);

  useEffect(() => {
    // Skip processing if providers data is empty
    if (!providers || providers.length === 0) {
      setFilteredProviders([]);
      return;
    }

    // Filter providers by the featured place IDs first
    const featuredProviders = providers.filter(provider => 
      provider.placeId && FEATURED_PLACE_IDS.includes(provider.placeId)
    );
    
    // If we have location info, further filter by distance
    if (location && featuredProviders.length > 0) {
      // Filter providers by distance within 50 miles
      const filtered = featuredProviders.filter(provider => {
        // First check if we have postal code to calculate distance
        const providerPostalCode = provider.postalCode;
        if (providerPostalCode && location.postalCode) {
          const distance = zipcodes.distance(location.postalCode, providerPostalCode);
          return distance !== null && distance <= 50;
        }
        
        // If no postal code, but we have coordinates, try to use those
        const providerLocation = provider.location;
        if (providerLocation && location.lat && location.lng) {
          // Calculate distance using Haversine formula (simplified)
          const lat1 = location.lat;
          const lon1 = location.lng;
          const lat2 = providerLocation.lat;
          const lon2 = providerLocation.lng;
          
          // Convert to radians
          const R = 3958.8; // Earth radius in miles
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const distance = R * c;
          
          return distance <= 50;
        }
        
        return false;
      });
      
      setFilteredProviders(filtered.length > 0 ? filtered : featuredProviders);
    } else {
      // If no location, show all featured providers
      setFilteredProviders(featuredProviders);
    }
  }, [providers, location?.postalCode, location?.lat, location?.lng]);

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
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Card>
            <CardContent className="pt-6">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Loading featured providers...
                </h2>
              </div>
            </CardContent>
          </Card>
        </div>
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
                <span className="text-primary-600"> in {location.city}, {location.state}</span>
              )}
            </CardTitle>
            <CardDescription className="text-lg leading-8 text-gray-600">
              Discover top-rated lawn care {filteredProviders.length === 1 ? 'professional' : 'professionals'} in your area
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <div className={`mt-8 grid gap-x-8 gap-y-20 ${getGridClasses()}`}>
              {filteredProviders.length > 0 ? (
                filteredProviders.map((provider) => (
                  <ProviderCard key={provider.placeId} provider={provider} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No featured providers found in your area.</p>
                  <p className="text-gray-500 mt-2">Try expanding your search or check back later.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 