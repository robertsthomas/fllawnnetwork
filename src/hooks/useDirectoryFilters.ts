import { useCallback, useEffect, useRef, useState } from 'react';
import { services } from '~/data/providers';
import { filterProvidersByRadius, getLocationInfo, type LocationInfo } from '~/lib/location';
import { directorySearchParams } from '~/lib/search-params';
import { Provider } from '~/types';
import { useQueryStates, parseAsString, parseAsInteger, parseAsArrayOf } from 'nuqs';
import { useRouter } from 'next/navigation';

export function useDirectoryFilters(providers: Provider[] | undefined, initialCity?: string) {
  const router = useRouter();
  const isInitialMount = useRef(true);

  // State for filtered providers
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);

  // URL state management with nuqs
  const [filters, setFilters] = useQueryStates(directorySearchParams);

  // Local state for UI
  const [zipcodeInput, setZipcodeInput] = useState<string>('');
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [activeService, setActiveService] = useState<string>('');
  const [city, setCity] = useState<string | null>(initialCity || null);

  // Flag to prevent recursive updates
  const isUpdatingRef = useRef(false);

  // Load initial values from URL on mount
  useEffect(() => {
    if (!isInitialMount.current) return;

    if (filters.zipcode) {
      setZipcodeInput(filters.zipcode);
      setLocationInfo(getLocationInfo(filters.zipcode));
    }

    if (filters.service) {
      const normalizedService = normalizeServiceName(filters.service);
      const matchingService = services.find(
        (s) => normalizeServiceName(s.name) === normalizedService
      );

      if (matchingService) {
        setActiveService(matchingService.name);
      } else {
        setActiveService(
          normalizedService
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        );
      }
    }

    isInitialMount.current = false;
  }, [filters.zipcode, filters.service]);

  // Apply filters to providers whenever providers or filter criteria change
  useEffect(() => {
    if (!providers || isUpdatingRef.current) return;

    // Apply filters to providers
    let filtered = [...(providers ?? [])] as Provider[];

    // Filter by service
    if (filters.service) {
      const normalizedService = normalizeServiceName(filters.service);
      filtered = filtered.filter((provider) =>
        provider.categories?.some(
          (category) => normalizeServiceName(category) === normalizedService
        )
      );
    }

    // Filter by selected services
    if (filters.services.length > 0) {
      filtered = filtered.filter((provider) =>
        provider.categories?.some((category) =>
          filters.services.some(
            (selectedService) =>
              normalizeServiceName(category) === normalizeServiceName(selectedService)
          )
        )
      );
    }

    // Filter by rating
    if (filters.rating > 0) {
      filtered = filtered.filter((provider) => (provider.totalScore || 0) >= filters.rating);
    }

    // Filter by city
    if (city) {
      const normalizedCity = city.toLowerCase();
      filtered = filtered.filter((provider) =>
        provider.address?.city?.toLowerCase().includes(normalizedCity)
      );
    }

    // Filter by zipcode and radius
    if (filters.zipcode) {
      filtered = filterProvidersByRadius<Provider>(filtered, filters.zipcode, filters.radius);
    }

    // Only update if the filtered results are different
    if (JSON.stringify(filtered) !== JSON.stringify(filteredProviders)) {
      setFilteredProviders(filtered);
    }
  }, [providers, filters, city, filteredProviders]);

  // Normalize service name
  const normalizeServiceName = (name: string): string => {
    return name.toLowerCase().replace(/-/g, ' ');
  };

  // Handle service selection toggle
  const toggleServiceSelection = useCallback(
    (serviceName: string) => {
      if (isUpdatingRef.current) return;

      const newSelectedServices = filters.services.includes(serviceName)
        ? filters.services.filter((s) => s !== serviceName)
        : [...filters.services, serviceName];

      setFilters({ services: newSelectedServices });
    },
    [filters.services, setFilters]
  );

  // Handle rating change
  const handleRatingChange = useCallback(
    (value: string) => {
      const ratingValue = parseInt(value);
      setFilters({ rating: ratingValue });
    },
    [setFilters]
  );

  // Handle radius change
  const handleRadiusChange = useCallback(
    (value: string) => {
      const radiusValue = Number(value);
      setFilters({ radius: radiusValue });
    },
    [setFilters]
  );

  // 
  //  filters
  const resetFilters = useCallback(() => {
    if (isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    try {
      // Reset local state
      setZipcodeInput('');
      setFilters({
        zipcode: null,
        radius: 25,
        services: [],
        rating: 0,
      });
      setCity(null);
      
      // Navigate to the base lawn-care page
      router.push('/lawn-care');
    } finally {
      // Clear the updating flag after a delay
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }
  }, [setFilters, router]);

  // Handle city change
  const handleCityChange = useCallback(
    (value: string | null) => {
      setCity(value);
      if (!value) {
        router.push('/lawn-care');
      }
    },
    [router]
  );

  // Handle zipcode change
  const handleZipcodeChange = useCallback(
    (value: string | null) => {
      setFilters({ zipcode: value });
      if (!value) {
        router.push('/lawn-care');
      }
    },
    [setFilters, router]
  );

  return {
    filteredProviders,
    activeService,
    zipcode: filters.zipcode,
    zipcodeInput,
    setZipcodeInput,
    setZipcode: handleZipcodeChange,
    radius: filters.radius,
    locationInfo,
    setLocationInfo,
    selectedServices: filters.services,
    rating: filters.rating,
    city,
    setCity: handleCityChange,
    resetFilters,
    toggleServiceSelection,
    handleRatingChange,
    handleRadiusChange,
  };
}
