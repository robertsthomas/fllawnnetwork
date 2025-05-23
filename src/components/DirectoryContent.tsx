'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProviderCard from './ProviderCard';
import { Provider } from '@/types';
import { filterProvidersByRadius, getLocationInfo } from '@/lib/location';

interface DirectoryContentProps {
  initialProviders: Provider[];
}

export default function DirectoryContent({ initialProviders = [] }: DirectoryContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [activeService, setActiveService] = useState<string>("");
  const [zipcode, setZipcode] = useState<string>("");
  const [zipcodeInput, setZipcodeInput] = useState<string>("");
  const [radius, setRadius] = useState<number>(25);
  const [locationInfo, setLocationInfo] = useState<any>(null);

  useEffect(() => {
    // Get parameters from URL or sessionStorage
    const urlZipcode = searchParams.get('zipcode') || 
      (typeof window !== 'undefined' ? sessionStorage.getItem('zipcode') : null);
    const service = searchParams.get('service');
    const urlRadius = searchParams.get('radius');

    if (urlZipcode !== null) {
      setZipcode(urlZipcode);
      setZipcodeInput(urlZipcode);
      const info = getLocationInfo(urlZipcode);
      setLocationInfo(info);
    } else {
      setZipcode("");
      setZipcodeInput("");
      setLocationInfo(null);
    }

    if (urlRadius) {
      setRadius(parseInt(urlRadius));
    }

    // Filter providers
    let filtered = [...initialProviders];

    // Filter by service
    if (service) {
      const normalizedService = service.toLowerCase().replace("-", " ");
      const foundService = filtered.find(s =>
        s.categories.some(c => c.toLowerCase() === normalizedService)
      )?.categories.find(c => c.toLowerCase() === normalizedService) || "";

      setActiveService(foundService);

      if (foundService) {
        filtered = filtered.filter(provider =>
          provider.categories.some(c => c.toLowerCase() === foundService.toLowerCase())
        );
      }
    }

    // Filter by zipcode and radius
    if (urlZipcode) {
      filtered = filterProvidersByRadius(filtered, urlZipcode, radius);
    }

    setFilteredProviders(filtered);
  }, [initialProviders, searchParams, radius]);

  const updateFilters = (newZipcode: string, newRadius: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newZipcode) {
      params.set('zipcode', newZipcode);
      sessionStorage.setItem('zipcode', newZipcode);
    } else {
      params.delete('zipcode');
      sessionStorage.removeItem('zipcode');
    }
    params.set('radius', newRadius.toString());
    router.push(`?${params.toString()}`);
  };

  // Only allow numbers in the input
  const handleZipcodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setZipcodeInput(value);
  };

  // Handle Enter key for zipcode
  const handleZipcodeInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (zipcodeInput === "" || zipcodeInput.length === 5) {
        setZipcode(zipcodeInput);
        updateFilters(zipcodeInput, radius);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Filters sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
              <div className="space-y-6">
                {/* Zipcode filter */}
                <div>
                  <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-1">
                    Zipcode
                  </label>
                  <input
                    type="text"
                    id="zipcode"
                    value={zipcodeInput}
                    onChange={handleZipcodeInputChange}
                    onKeyDown={handleZipcodeInputKeyDown}
                    placeholder="Enter zipcode"
                    minLength={0}
                    maxLength={5}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter 5 digits and press Enter</p>
                </div>
                {/* Radius filter */}
                <div>
                  <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">
                    Search Radius
                  </label>
                  <select
                    id="radius"
                    value={radius}
                    onChange={e => {
                      const newRadius = Number(e.target.value);
                      setRadius(newRadius);
                      updateFilters(zipcode, newRadius);
                    }}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="10">10 miles</option>
                    <option value="25">25 miles</option>
                    <option value="50">50 miles</option>
                    <option value="100">100 miles</option>
                  </select>
                </div>
                {/* Placeholder: Service filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Services</h3>
                  <div className="space-y-2 text-gray-500 text-sm italic">(Service checkboxes go here)</div>
                </div>
                {/* Placeholder: Rating filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Minimum Rating</h3>
                  <div className="space-y-2 text-gray-500 text-sm italic">(Rating radios go here)</div>
                </div>
                {/* Placeholder: Price range filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Price Range</h3>
                  <div className="space-y-2 text-gray-500 text-sm italic">(Price slider goes here)</div>
                </div>
                {/* Placeholder: Apply Filters button */}
                <button
                  type="button"
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Providers list */}
        <div className="mt-8 lg:mt-0 lg:col-span-9">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {filteredProviders.length} providers found
                  {activeService && (
                    <span className="text-gray-600 text-base font-normal">
                      for {activeService}
                    </span>
                  )}
                  {zipcode && locationInfo && (
                    <span className="text-gray-600 text-base font-normal">
                      {activeService ? " " : " in "}
                      {locationInfo.city}, {locationInfo.state} within {radius} miles
                    </span>
                  )}
                </h2>
              </div>
            </div>
          </div>
          {/* Provider cards */}
          {filteredProviders.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {filteredProviders.map((provider, index) => (
                <ProviderCard key={index} provider={provider} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No providers found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search radius or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 