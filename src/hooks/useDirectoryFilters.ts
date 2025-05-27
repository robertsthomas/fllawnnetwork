import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { filterProvidersByRadius, getLocationInfo } from '~/lib/location';
import { services } from '~/data/providers';
import { Provider } from '~/types';

export function useDirectoryFilters(providers: Provider[] | undefined) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [activeService, setActiveService] = useState<string>("");
  const [zipcode, setZipcode] = useState<string>("");
  const [zipcodeInput, setZipcodeInput] = useState<string>("");
  const [radius, setRadius] = useState<number>(25);
  const [locationInfo, setLocationInfo] = useState<any>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);

  // Apply filters and update URL
  const updateFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update zipcode
    if (zipcode) {
      params.set('zipcode', zipcode);
    } else {
      params.delete('zipcode');
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

  // Update URL directly with a single parameter
  const updateUrlParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value !== null) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    router.push(`?${params.toString()}`);
  };

  // Reset all filters
  const resetFilters = () => {
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
    
    router.push(params.toString() ? `?${params.toString()}` : '');
  };

  // Handle service selection toggle
  const toggleServiceSelection = (serviceName: string) => {
    setSelectedServices(prev => {
      const newSelectedServices = prev.includes(serviceName)
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName];
      
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
    updateUrlParam('rating', ratingValue > 0 ? value : null);
  };

  // Handle radius change
  const handleRadiusChange = (value: string) => {
    const radiusValue = Number(value);
    setRadius(radiusValue);
    updateUrlParam('radius', value);
  };

  // Normalize service name from URL
  const normalizeServiceName = (name: string): string => {
    return name.toLowerCase().replace(/-/g, ' ');
  };

  // Filter providers based on current filter values
  useEffect(() => {
    if (!providers) return;

    // Get parameters from URL
    const urlZipcode = searchParams.get('zipcode');
    const service = searchParams.get('service');
    const urlRadius = searchParams.get('radius');
    const urlRating = searchParams.get('rating');
    const urlServices = searchParams.get('services');

    // Set state from URL parameters
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

    // Apply filters to providers
    let filtered = [...(providers ?? [])] as Provider[];

    // Filter by service from the URL query parameter
    if (service) {
      const normalizedService = normalizeServiceName(service);
      
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
    }

    // Filter by selected services
    if (urlServices && urlServices.split(',').length > 0) {
      const servicesArray = urlServices.split(',');
      
      filtered = filtered.filter(provider =>
        provider.categories?.some(category => 
          servicesArray.some(selectedService => 
            normalizeServiceName(category) === normalizeServiceName(selectedService)
          )
        )
      );
    }

    // Filter by rating
    if (urlRating) {
      filtered = filtered.filter(provider => (provider.totalScore || 0) >= parseInt(urlRating));
    }

    // Filter by zipcode and radius
    if (urlZipcode) {
      filtered = filterProvidersByRadius<Provider>(filtered, urlZipcode, parseInt(urlRadius || '25'));
    }

    setFilteredProviders(filtered);
  }, [providers, searchParams]);

  return {
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
    handleRadiusChange
  };
} 