import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { services } from '~/data/providers';
import { filterProvidersByRadius, getLocationInfo } from '~/lib/location';
import { Provider } from '~/types';

export function useDirectoryFilters(providers: Provider[] | undefined, initialCity?: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);

  // State for filtered providers
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);

  // State for UI filters
  const [activeService, setActiveService] = useState<string>('');
  const [zipcode, setZipcode] = useState<string>('');
  const [zipcodeInput, setZipcodeInput] = useState<string>('');
  const [radius, setRadius] = useState<number>(25);
  const [locationInfo, setLocationInfo] = useState<any>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [city, setCity] = useState<string>(initialCity || '');

  // Flag to prevent recursive updates
  const isUpdatingRef = useRef(false);

  // Load initial values from URL on mount
  useEffect(() => {
    if (!isInitialMount.current) return;

    // Get parameters from URL
    const urlZipcode = searchParams.get('zipcode') || '';
    const urlService = searchParams.get('service') || '';
    const urlRadius = searchParams.get('radius') || '25';
    const urlRating = searchParams.get('rating') || '0';
    const urlServices = searchParams.get('services') || '';
    const urlCity = searchParams.get('city') || initialCity || '';

    // Set initial state from URL
    if (urlZipcode) {
      setZipcode(urlZipcode);
      setZipcodeInput(urlZipcode);
      setLocationInfo(getLocationInfo(urlZipcode));
    }

    if (urlCity) {
      setCity(urlCity);
    }

    if (urlService) {
      const normalizedService = normalizeServiceName(urlService);
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

    setRadius(parseInt(urlRadius) || 25);
    setMinRating(parseInt(urlRating) || 0);

    if (urlServices) {
      setSelectedServices(urlServices.split(','));
    }

    isInitialMount.current = false;
  }, [searchParams, initialCity]);

  // Apply filters to providers whenever providers or filter criteria change
  useEffect(() => {
    if (!providers || isUpdatingRef.current) return;

    // Apply filters to providers
    let filtered = [...(providers ?? [])] as Provider[];

    // Filter by service from the URL query parameter
    const service = searchParams.get('service');
    if (service) {
      const normalizedService = normalizeServiceName(service);
      filtered = filtered.filter((provider) =>
        provider.categories?.some(
          (category) => normalizeServiceName(category) === normalizedService
        )
      );
    }

    // Filter by selected services from URL
    const urlServices = searchParams.get('services');
    if (urlServices && urlServices.split(',').length > 0) {
      const servicesArray = urlServices.split(',');
      filtered = filtered.filter((provider) =>
        provider.categories?.some((category) =>
          servicesArray.some(
            (selectedService) =>
              normalizeServiceName(category) === normalizeServiceName(selectedService)
          )
        )
      );
    }

    // Filter by rating from URL
    const urlRating = searchParams.get('rating');
    if (urlRating) {
      filtered = filtered.filter((provider) => (provider.totalScore || 0) >= parseInt(urlRating));
    }

    // Filter by city from URL or initialCity
    const urlCity = searchParams.get('city') || initialCity;
    if (urlCity) {
      const normalizedCity = urlCity.toLowerCase();
      filtered = filtered.filter((provider) =>
        provider.address?.city?.toLowerCase().includes(normalizedCity)
      );
    }

    // Filter by zipcode and radius from URL
    const urlZipcode = searchParams.get('zipcode');
    const urlRadius = searchParams.get('radius') || '25';
    if (urlZipcode) {
      filtered = filterProvidersByRadius<Provider>(filtered, urlZipcode, parseInt(urlRadius));
    }

    // Only update if the filtered results are different
    if (JSON.stringify(filtered) !== JSON.stringify(filteredProviders)) {
      setFilteredProviders(filtered);
    }
  }, [providers, searchParams, filteredProviders, initialCity]);

  // Normalize service name
  const normalizeServiceName = (name: string): string => {
    return name.toLowerCase().replace(/-/g, ' ');
  };

  // Update URL with current filter state
  const updateUrlWithFilters = useCallback(() => {
    if (isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    try {
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

      // Preserve service param if it exists
      const serviceParam = searchParams.get('service');
      if (serviceParam) {
        params.set('service', serviceParam);
      }

      // Only update URL if params have changed
      const newParamsString = params.toString();
      if (newParamsString !== searchParams.toString()) {
        router.push(`?${newParamsString}`);
      }
    } finally {
      // Clear the updating flag after a delay
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }
  }, [zipcode, radius, selectedServices, minRating, searchParams, router]);

  // Update a single URL parameter
  const updateUrlParam = useCallback(
    (key: string, value: string | null) => {
      if (isUpdatingRef.current) return;

      isUpdatingRef.current = true;

      try {
        const params = new URLSearchParams(searchParams.toString());

        if (value !== null) {
          params.set(key, value);
        } else {
          params.delete(key);
        }

        router.push(`?${params.toString()}`);
      } finally {
        // Clear the updating flag after a delay
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 100);
      }
    },
    [searchParams, router]
  );

  // Reset all filters
  const resetFilters = useCallback(() => {
    if (isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    try {
      // Reset local state
      setZipcode('');
      setZipcodeInput('');
      setRadius(25);
      setSelectedServices([]);
      setMinRating(0);

      // Keep only service param if it exists, remove all other params
      const params = new URLSearchParams();
      const serviceParam = searchParams.get('service');
      if (serviceParam) {
        params.set('service', serviceParam);
      }

      router.push(params.toString() ? `?${params.toString()}` : '');
    } finally {
      // Clear the updating flag after a delay
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }
  }, [searchParams, router]);

  // Handle service selection toggle
  const toggleServiceSelection = useCallback(
    (serviceName: string) => {
      if (isUpdatingRef.current) return;

      // Update local state first
      const newSelectedServices = selectedServices.includes(serviceName)
        ? selectedServices.filter((s) => s !== serviceName)
        : [...selectedServices, serviceName];

      setSelectedServices(newSelectedServices);

      // Then update URL
      isUpdatingRef.current = true;

      try {
        const params = new URLSearchParams(searchParams.toString());

        if (newSelectedServices.length > 0) {
          params.set('services', newSelectedServices.join(','));
        } else {
          params.delete('services');
        }

        router.push(`?${params.toString()}`);
      } finally {
        // Clear the updating flag after a delay
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 100);
      }
    },
    [selectedServices, searchParams, router]
  );

  // Handle rating change
  const handleRatingChange = useCallback(
    (value: string) => {
      if (isUpdatingRef.current) return;

      const ratingValue = parseInt(value);
      setMinRating(ratingValue);

      isUpdatingRef.current = true;

      try {
        const params = new URLSearchParams(searchParams.toString());

        if (ratingValue > 0) {
          params.set('rating', value);
        } else {
          params.delete('rating');
        }

        router.push(`?${params.toString()}`);
      } finally {
        // Clear the updating flag after a delay
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 100);
      }
    },
    [searchParams, router]
  );

  // Handle radius change
  const handleRadiusChange = useCallback(
    (value: string) => {
      if (isUpdatingRef.current) return;

      const radiusValue = Number(value);
      setRadius(radiusValue);

      isUpdatingRef.current = true;

      try {
        const params = new URLSearchParams(searchParams.toString());
        params.set('radius', value);
        router.push(`?${params.toString()}`);
      } finally {
        // Clear the updating flag after a delay
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 100);
      }
    },
    [searchParams, router]
  );

  return {
    filteredProviders,
    activeService,
    zipcode,
    zipcodeInput,
    setZipcodeInput,
    setZipcode,
    radius,
    locationInfo,
    setLocationInfo,
    selectedServices,
    minRating,
    city,
    updateFilters: updateUrlWithFilters,
    updateUrlParam,
    resetFilters,
    toggleServiceSelection,
    handleRatingChange,
    handleRadiusChange,
  };
}
