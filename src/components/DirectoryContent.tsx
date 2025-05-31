'use client';

import React from 'react';
import {
  CellContext,
  Row,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useQuery } from 'convex/react';
import { ChevronLeft, ChevronRight, Star, XCircle } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { memo, useCallback, useRef, useState } from 'react';
import { services } from '~/data/providers';
import { useDirectoryFilters } from '~/hooks/useDirectoryFilters';
import { getLocationInfo } from '~/lib/location';
import { Provider } from '~/types';
import { api } from '../../convex/_generated/api';
import DirectoryLoading from './DirectoryLoading';
import ProviderCard from './ProviderCard';
import GoogleAdCard from './GoogleAdCard';
import { useFeatureFlagEnabled } from 'posthog-js/react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
// shadcn UI components
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

// Create a more stable memoized version of Select to prevent unnecessary re-renders
const MemoizedSelect = memo(
  ({
    value,
    onValueChange,
    children,
  }: {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
  }) => {
    const previousValueRef = useRef(value);

    const handleValueChange = useCallback(
      (newValue: string) => {
        if (newValue !== previousValueRef.current) {
          previousValueRef.current = newValue;
          onValueChange(newValue);
        }
      },
      [onValueChange]
    );

    return (
      <Select value={value} onValueChange={handleValueChange}>
        {children}
      </Select>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison to prevent unnecessary re-renders
    return prevProps.value === nextProps.value;
  }
);

MemoizedSelect.displayName = 'MemoizedSelect';

// Create a more stable memoized version of RadioGroup to prevent unnecessary re-renders
const MemoizedRadioGroup = memo(
  ({
    value,
    onValueChange,
    children,
  }: {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
  }) => {
    const previousValueRef = useRef(value);

    const handleValueChange = useCallback(
      (newValue: string) => {
        if (newValue !== previousValueRef.current) {
          previousValueRef.current = newValue;
          onValueChange(newValue);
        }
      },
      [onValueChange]
    );

    return (
      <RadioGroup value={value} onValueChange={handleValueChange}>
        {children}
      </RadioGroup>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison to prevent unnecessary re-renders
    return prevProps.value === nextProps.value;
  }
);

MemoizedRadioGroup.displayName = 'MemoizedRadioGroup';

// Define column helper
const columnHelper = createColumnHelper<Provider>();

// Add this helper function at the top level
function getPageRange(currentPage: number, totalPages: number) {
  const delta = 2; // Number of pages to show on each side of current page
  const range = [];

  for (
    let i = Math.max(1, currentPage - delta);
    i <= Math.min(totalPages, currentPage + delta);
    i++
  ) {
    range.push(i);
  }

  // Add first page and ellipsis if needed
  if (range[0] > 1) {
    range.unshift(1);
    if (range[1] > 2) {
      range.splice(1, 0, -1); // -1 represents ellipsis
    }
  }

  // Add last page and ellipsis if needed
  if (range[range.length - 1] < totalPages) {
    if (range[range.length - 2] < totalPages - 1) {
      range.splice(range.length - 1, 0, -1); // -1 represents ellipsis
    }
    range.push(totalPages);
  }

  return range;
}

// Add this helper function at the top level
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export default function DirectoryContent({
  initialCity,
}: {
  initialCity?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const providers = useQuery(api.providers.get) as Provider[] | undefined;
  const isLoading = providers === undefined;
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const radiusFromUrl = searchParams.get('radius') || '25';
  const ratingFromUrl = searchParams.get('rating') || '0';
  const [cityInput, setCityInput] = useState<string>(initialCity || '');
  const flagEnabled = useFeatureFlagEnabled('show-provider-card-ads');
  const params = useParams();

  const {
    filteredProviders,
    activeService,
    zipcode,
    zipcodeInput,
    setZipcodeInput,
    setZipcode,
    radius,
    locationInfo,
    selectedServices,
    minRating,
    updateFilters,
    updateUrlParam,
    resetFilters,
    toggleServiceSelection,
    handleRatingChange,
    handleRadiusChange,
    setLocationInfo,
  } = useDirectoryFilters(providers || [], initialCity);

  // Setup table
  const table = useReactTable({
    data: filteredProviders,
    columns: [
      columnHelper.accessor('_id', {
        cell: ({ row }: { row: Row<Provider> }) => <ProviderCard provider={row.original} />,
      }),
    ],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 12,
      },
    },
  });

  // Only allow numbers in the input
  const handleZipcodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setZipcodeInput(value);
    // Clear city when zipcode is entered
    if (value) {
      setCityInput('');
      updateUrlParam('city', null);
    }
  };

  // Handle Enter key for zipcode
  const handleZipcodeInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (zipcodeInput === '' || zipcodeInput.length === 5) {
        setZipcode(zipcodeInput);
        updateUrlParam('zipcode', zipcodeInput || null);
        // Update location info when zipcode changes
        if (zipcodeInput) {
          const locationInfo = getLocationInfo(zipcodeInput);
          if (locationInfo) {
            setLocationInfo(locationInfo);
          }
        }
      }
    }
  };

  // Handle city input change
  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCityInput(value);
    // Clear zipcode when city is entered
    if (value) {
      setZipcodeInput('');
      setZipcode('');
      updateUrlParam('zipcode', null);
    } else {
      // When city is cleared, update URL to remove city parameter
      updateUrlParam('city', null);
      // Navigate back to main lawn-care page without city in URL
      router.push('/lawn-care');
    }
  };

  // Handle Enter key for city
  const handleCityInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (cityInput) {
        const formattedCity = cityInput.toLowerCase().replace(/\s+/g, '-');
        updateUrlParam('city', formattedCity);
        // Navigate to city-specific URL
        router.push(`/lawn-care/${formattedCity}`);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Mobile filter button */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            className="w-full flex justify-between items-center"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <span>Filters</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transform ${isFiltersOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </div>

        {/* Filters sidebar */}
        <div className={`${isFiltersOpen ? 'block' : 'hidden'} lg:block lg:col-span-3`}>
          <div className="sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="multiple" className="w-full" defaultValue={['location', 'rating']}>
                  {/* Location filter */}
                  <AccordionItem value="location">
                    <AccordionTrigger className="px-6">Location</AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <div className="relative">
                            <Input
                              id="city"
                              value={cityInput}
                              onChange={handleCityInputChange}
                              onKeyDown={handleCityInputKeyDown}
                              placeholder="Enter city name"
                              className="pr-8"
                            />
                            {cityInput && (
                              <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                onClick={() => {
                                  setCityInput('');
                                  updateUrlParam('city', null);
                                  router.replace('/lawn-care');
                                }}
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="zipcode">Zipcode</Label>
                          <div className="relative">
                            <Input
                              id="zipcode"
                              value={zipcodeInput}
                              onChange={handleZipcodeInputChange}
                              onKeyDown={handleZipcodeInputKeyDown}
                              placeholder="Enter zipcode"
                              minLength={0}
                              maxLength={5}
                              className="pr-8"
                            />
                            {zipcodeInput && (
                              <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                onClick={() => {
                                  setZipcodeInput('');
                                  setZipcode('');
                                  updateUrlParam('zipcode', null);
                                }}
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Enter 5 digits and press Enter
                          </p>
                        </div>

                        <div className="pt-2">
                          <Label htmlFor="radius" className="mb-2">
                            Search Radius
                          </Label>
                          <MemoizedSelect value={radiusFromUrl} onValueChange={handleRadiusChange}>
                            <SelectTrigger id="radius">
                              <SelectValue placeholder="Select radius" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10 miles</SelectItem>
                              <SelectItem value="25">25 miles</SelectItem>
                              <SelectItem value="50">50 miles</SelectItem>
                              <SelectItem value="100">100 miles</SelectItem>
                            </SelectContent>
                          </MemoizedSelect>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Services filter */}
                  <AccordionItem value="services">
                    <AccordionTrigger className="px-6">Services</AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="space-y-3">
                        {services.map((service) => (
                          <div key={service.id} className="flex items-center space-x-2">
                            <Checkbox
                              disabled
                              id={`service-${service.id}`}
                              checked={selectedServices.includes(service.name)}
                              onCheckedChange={() => toggleServiceSelection(service.name)}
                            />
                            <Label
                              htmlFor={`service-${service.id}`}
                              className="flex items-center text-sm cursor-pointer"
                            >
                              <span className="mr-2">{service.icon}</span>
                              {service.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Rating filter */}
                  <AccordionItem value="rating">
                    <AccordionTrigger className="px-6">Minimum Rating</AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <MemoizedRadioGroup value={ratingFromUrl} onValueChange={handleRatingChange}>
                        {[0, 1, 2, 3, 4, 5].map((rating) => (
                          <div key={rating} className="flex items-center space-x-2 py-1">
                            <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                            <Label
                              htmlFor={`rating-${rating}`}
                              className="flex items-center cursor-pointer"
                            >
                              {rating === 0 ? (
                                <span>Any rating</span>
                              ) : (
                                <div className="flex items-center">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < rating
                                          ? 'text-yellow-400 fill-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                  <span className="ml-1 text-sm">{rating === 1 ? '& up' : ''}</span>
                                </div>
                              )}
                            </Label>
                          </div>
                        ))}
                      </MemoizedRadioGroup>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="p-6 space-y-2">
                  <Button onClick={updateFilters} className="w-full">
                    Apply Filters
                  </Button>
                  <Button variant="outline" onClick={resetFilters} className="w-full">
                    Reset Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Providers list */}
        <div className="mt-8 lg:mt-0 lg:col-span-9">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    {filteredProviders.length} providers found
                    {activeService && (
                      <span className="text-gray-600 text-base font-normal">
                        for {activeService}
                      </span>
                    )}
                    {cityInput ? (
                      <span className="text-gray-600 text-base font-normal">
                        {activeService ? ' ' : ' in '}
                        {Array.from(
                          new Set(filteredProviders.map((p) => p.address?.city).filter(Boolean))
                        ).join(', ')}
                      </span>
                    ) : (
                      <span className="text-gray-600 text-base font-normal">
                        {/* {activeService ? " " : " "}showing all providers */}
                      </span>
                    )}
                    {zipcode && locationInfo && (
                      <span className="text-gray-600 text-base font-normal">
                        {activeService ? ' ' : ' in '}
                        {params?.city ? (params.city as string).replace(/-/g, ' ') : locationInfo.city}, {locationInfo.state} within {radius} miles
                      </span>
                    )}
                  </h2>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading state or providers list */}
          {isLoading ? (
            <DirectoryLoading />
          ) : (
            <div className="space-y-6">
              {/* Provider cards */}
              {filteredProviders.length > 0 ? (
                <>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {table.getRowModel().rows.map((row: Row<Provider>, index: number) => {
                      // Only insert ad if we have at least 4 providers and it's after the first 3 cards
                      const shouldInsertAd = 
                        flagEnabled && 
                        filteredProviders.length >= 4 && 
                        index === Math.floor(Math.random() * 2 + 3);
                      return (
                        <React.Fragment key={`row-${row.id}`}>
                          {shouldInsertAd && <GoogleAdCard key={`ad-${row.id}`} />}
                          <div key={`provider-${row.id}`}>
                            {flexRender(row.getVisibleCells()[0].column.columnDef.cell, {
                              row,
                              table,
                              getValue: () => row.original,
                            } as CellContext<Provider, unknown>)}
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* Pagination controls */}
                  {table.getPageCount() > 1 && (
                    <div className="flex items-center justify-center space-x-2 mt-8">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          table.previousPage();
                          scrollToTop();
                        }}
                        disabled={!table.getCanPreviousPage()}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Previous</span>
                      </Button>

                      {/* Page numbers */}
                      <div className="flex items-center space-x-1">
                        {getPageRange(
                          table.getState().pagination.pageIndex + 1,
                          table.getPageCount()
                        ).map((pageNum, idx) =>
                          pageNum === -1 ? (
                            <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
                              ...
                            </span>
                          ) : (
                            <Button
                              key={pageNum}
                              variant={
                                pageNum === table.getState().pagination.pageIndex + 1
                                  ? 'default'
                                  : 'outline'
                              }
                              size="sm"
                              onClick={() => {
                                table.setPageIndex(pageNum - 1);
                                scrollToTop();
                              }}
                              className="min-w-[2rem]"
                            >
                              {pageNum}
                            </Button>
                          )
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          table.nextPage();
                          scrollToTop();
                        }}
                        disabled={!table.getCanNextPage()}
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Lawn Care in {(params?.city as string)?.replace(/-/g, ' ') || cityInput || 'Your Area'}
                    </h2>
                    
                    {/* City-specific description */}
                    {(params?.city || cityInput) && (
                      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          About {(params?.city as string)?.replace(/-/g, ' ') || cityInput}
                        </h3>
                        <p className="text-gray-600">
                          {(params?.city as string)?.replace(/-/g, ' ') || cityInput}, Florida is known for its subtropical climate, which supports year-round lawn growth. 
                          Warm-season grasses like St. Augustine and Bahia thrive in this region, making it ideal for 
                          maintaining lush, green lawns throughout the year. The area's unique climate and soil conditions 
                          require specific lawn care practices to ensure optimal growth and health.
                        </p>
                      </div>
                    )}

                    <p className="text-gray-600 mb-6">
                      We're working on listing the best lawn care providers in {(params?.city as string)?.replace(/-/g, ' ') || cityInput || 'your area'}. In the meantime, here's what you need to know about maintaining your lawn in this region.
                    </p>
                    
                    <div className="grid gap-6 md:grid-cols-2 text-left mb-8">
                      <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">🌱 Recommended Grass Types</h3>
                        <ul className="space-y-2 text-gray-600">
                          <li>• St. Augustine Grass</li>
                          <li>• Zoysia Grass</li>
                          <li>• Bahia Grass</li>
                          <li>• Bermuda Grass</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">📅 Typical Mowing Schedule</h3>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Spring: Weekly mowing</li>
                          <li>• Summer: Every 5-7 days</li>
                          <li>• Fall: Every 7-10 days</li>
                          <li>• Winter: Monthly maintenance</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 DIY Maintenance Tips</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Keep grass height between 2.5-3.5 inches</li>
                        <li>• Water deeply but infrequently (1-1.5 inches per week)</li>
                        <li>• Fertilize 3-4 times per year</li>
                        <li>• Aerate your lawn annually</li>
                        <li>• Control weeds early in the season</li>
                      </ul>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">💰 Estimated Service Costs</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Basic Lawn Mowing: $30-50 per visit</li>
                        <li>• Fertilization: $40-80 per application</li>
                        <li>• Weed Control: $40-60 per treatment</li>
                        <li>• Aeration: $60-100 per service</li>
                      </ul>
                    </div>

                    <p className="text-gray-600 mt-8">
                      Check back soon as we continue to add top-rated service providers in your area. In the meantime, feel free to explore our full directory of trusted lawn care professionals.
                    </p>
                    <Button
                      onClick={() => router.push('/lawn-care')}
                      className="mt-6"
                    >
                      Browse Full Directory
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
