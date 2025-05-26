'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProviderCard from './ProviderCard';
import { LawnCareProvider } from '@/types';
import { filterProvidersByRadius, getLocationInfo } from '@/lib/location';
import { services } from '@/data/providers';
import { XCircle, Star } from 'lucide-react';
import { useProviders } from '@/hooks/useProviders';

// shadcn UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  RadioGroup,
  RadioGroupItem
} from '@/components/ui/radio-group';

interface DirectoryContentProps {
  initialProviders: LawnCareProvider[];
}

export default function DirectoryContent({ initialProviders = [] }: DirectoryContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get providers from TanStack Query
  const { data: providersFromApi = [], isLoading: isProvidersLoading } = useProviders();
  
  // Use providersFromApi instead of initialProviders
  const [providers, setProviders] = useState<LawnCareProvider[]>(providersFromApi.length > 0 ? providersFromApi : initialProviders);
  
  // Update providers when data from API is loaded
  useEffect(() => {
    if (providersFromApi.length > 0) {
      setProviders(providersFromApi);
    }
  }, [providersFromApi]);

  const [filteredProviders, setFilteredProviders] = useState<LawnCareProvider[]>([]);
  const [activeService, setActiveService] = useState<string>("");
  const [zipcode, setZipcode] = useState<string>("");
  const [zipcodeInput, setZipcodeInput] = useState<string>("");
  const [radius, setRadius] = useState<number>(25);
  const [locationInfo, setLocationInfo] = useState<any>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

  useEffect(() => {
    // Get parameters from URL or sessionStorage
    const urlZipcode = searchParams.get('zipcode') || 
      (typeof window !== 'undefined' ? sessionStorage.getItem('zipcode') : null);
    const service = searchParams.get('service');
    const urlRadius = searchParams.get('radius');
    const urlRating = searchParams.get('rating');
    const urlServices = searchParams.get('services');

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

    if (urlRating) {
      setMinRating(parseInt(urlRating));
    }

    if (urlServices) {
      setSelectedServices(urlServices.split(','));
    } else {
      setSelectedServices([]);
    }

    // Filter providers
    let filtered = [...providers];

    // Normalize service name from URL
    const normalizeServiceName = (name: string): string => {
      return name.toLowerCase().replace(/-/g, ' ');
    };

    // Filter by service from the URL query parameter
    if (service) {
      const normalizedService = normalizeServiceName(service);
      console.log("filtering by service:", normalizedService);
      
      // Find matching service in our service list for display purposes
      const matchingService = services.find(s => 
        normalizeServiceName(s.name) === normalizedService
      );
      
      if (matchingService) {
        setActiveService(matchingService.name);
      } else {
        // If no exact match, capitalize first letter of each word for display
        setActiveService(normalizedService
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        );
      }

      // Filter providers by the normalized service
      filtered = filtered.filter((provider) =>
        provider.categories?.some(category => 
          normalizeServiceName(category) === normalizedService
        )
      );
      
      console.log("filtered by service:", filtered);
    }

    // Filter by selected services (if any)
    if (urlServices && urlServices.split(',').length > 0) {
      const servicesArray = urlServices.split(',');
      console.log("filtering by services:", servicesArray);
      
      filtered = filtered.filter(provider =>
        provider.categories?.some(category => 
          servicesArray.some(selectedService => 
            normalizeServiceName(category) === normalizeServiceName(selectedService)
          )
        )
      );
      
      console.log("filtered by selected services:", filtered);
    }

    // Filter by rating
    if (urlRating) {
      filtered = filtered.filter(provider => (provider.totalScore || 0) >= parseInt(urlRating));
    }

    // Filter by zipcode and radius
    if (urlZipcode) {
      filtered = filterProvidersByRadius(filtered, urlZipcode, parseInt(urlRadius || '25'));
    }

    setFilteredProviders(filtered);
  }, [providers, searchParams]);

  const updateFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update zipcode
    if (zipcode) {
      params.set('zipcode', zipcode);
      sessionStorage.setItem('zipcode', zipcode);
    } else {
      params.delete('zipcode');
      sessionStorage.removeItem('zipcode');
    }
    
    // Update radius
    params.set('radius', radius.toString());
    
    // Update services
    if (selectedServices.length > 0) {
      params.set('services', selectedServices.join(','));
    } else {
      params.delete('services');
    }
    
    // Update rating
    if (minRating > 0) {
      params.set('rating', minRating.toString());
    } else {
      params.delete('rating');
    }
    
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
        updateFilters();
      }
    }
  };

  const toggleServiceSelection = (serviceName: string) => {
    setSelectedServices(prev => {
      const newSelectedServices = prev.includes(serviceName)
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName];
      
      // Update URL immediately after state change
      setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (newSelectedServices.length > 0) {
          params.set('services', newSelectedServices.join(','));
        } else {
          params.delete('services');
        }
        router.push(`?${params.toString()}`);
      }, 0);
      
      return newSelectedServices;
    });
  };
  
  // Handle rating change
  const handleRatingChange = (value: string) => {
    const ratingValue = parseInt(value);
    setMinRating(ratingValue);
    
    // Update URL immediately
    const params = new URLSearchParams(searchParams.toString());
    if (ratingValue > 0) {
      params.set('rating', value);
    } else {
      params.delete('rating');
    }
    router.push(`?${params.toString()}`);
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
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transform ${isFiltersOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
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
                <Accordion type="multiple" className="w-full" defaultValue={["location", "services", "rating"]}>
                  {/* Location filter */}
                  <AccordionItem value="location">
                    <AccordionTrigger className="px-6">Location</AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
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
                                // Explicitly remove zipcode from URL
                                const params = new URLSearchParams(searchParams.toString());
                                params.delete('zipcode');
                                router.push(`?${params.toString()}`);
                                sessionStorage.removeItem('zipcode');
                              }}
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">Enter 5 digits and press Enter</p>
                        
                        <div className="pt-2">
                          <Label htmlFor="radius" className="mb-2">Search Radius</Label>
                          <Select
                            value={radius.toString()}
                            onValueChange={(value) => {
                              const newRadius = Number(value);
                              setRadius(newRadius);
                              
                              // Wait a moment to update filters to avoid re-render conflicts
                              setTimeout(() => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.set('radius', newRadius.toString());
                                
                                if (zipcode) {
                                  params.set('zipcode', zipcode);
                                }
                                
                                router.push(`?${params.toString()}`);
                              }, 0);
                            }}
                          >
                            <SelectTrigger id="radius">
                              <SelectValue placeholder="Select radius" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10 miles</SelectItem>
                              <SelectItem value="25">25 miles</SelectItem>
                              <SelectItem value="50">50 miles</SelectItem>
                              <SelectItem value="100">100 miles</SelectItem>
                            </SelectContent>
                          </Select>
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
                      <RadioGroup 
                        value={minRating.toString()} 
                        onValueChange={handleRatingChange}
                      >
                        {[0, 1, 2, 3, 4, 5].map((rating) => (
                          <div key={rating} className="flex items-center space-x-2 py-1">
                            <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                            <Label htmlFor={`rating-${rating}`} className="flex items-center cursor-pointer">
                              {rating === 0 ? (
                                <span>Any rating</span>
                              ) : (
                                <div className="flex items-center">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                    />
                                  ))}
                                  <span className="ml-1 text-sm">{rating === 1 ? '& up' : ''}</span>
                                </div>
                              )}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="p-6 space-y-2">
                  <Button 
                    onClick={updateFilters}
                    className="w-full"
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Reset all filter states
                      setZipcode('');
                      setZipcodeInput('');
                      setRadius(25);
                      setSelectedServices([]);
                      setMinRating(0);
                      
                      // Keep only service param if it exists, remove all other params
                      const params = new URLSearchParams();
                      if (searchParams.get('service')) {
                        params.set('service', searchParams.get('service')!);
                      }
                      
                      // Clear zipcode in session storage
                      sessionStorage.removeItem('zipcode');
                      
                      // Update URL
                      router.push(params.toString() ? `?${params.toString()}` : '');
                    }}
                    className="w-full"
                  >
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
                    {zipcode && locationInfo && (
                      <span className="text-gray-600 text-base font-normal">
                        {activeService ? " " : " in "}
                        {locationInfo.city}, {locationInfo.state} within {radius} miles
                      </span>
                    )}
                  </h2>
                </div>
              </div>
            </CardContent>
          </Card>
          
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