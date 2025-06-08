'use client';

import { useState, useEffect, useRef } from 'react';
import { mapService, type GeocodingResult } from '../lib/map-service';

export interface AddressSearchProps {
  onAddressSelect?: (result: GeocodingResult) => void;
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
  placeholder?: string;
  className?: string;
  showCurrentLocationButton?: boolean;
  restrictToFlorida?: boolean;
}

export default function AddressSearch({
  onAddressSelect,
  onLocationSelect,
  placeholder = "Search for an address...",
  className = "",
  showCurrentLocationButton = true,
  restrictToFlorida = false,
}: AddressSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search function
  const performSearch = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let searchResults: GeocodingResult[];
      
      if (restrictToFlorida) {
        searchResults = await mapService.geocodeInFlorida(searchQuery);
      } else {
        searchResults = await mapService.geocode(searchQuery);
      }

      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
      setSelectedIndex(-1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout for debounced search
    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle result selection
  const handleResultSelect = (result: GeocodingResult) => {
    setQuery(result.display_name);
    setIsOpen(false);
    setSelectedIndex(-1);
    
    onAddressSelect?.(result);
    onLocationSelect?.(result.lat, result.lon, result.display_name);
  };

  // Handle current location button
  const handleCurrentLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const location = await mapService.getCurrentLocation();
      setQuery(location.address || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);
      
      onLocationSelect?.(location.lat, location.lng, location.address || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get current location');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder={placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {showCurrentLocationButton && (
          <button
            onClick={handleCurrentLocation}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            title="Use current location"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="hidden sm:inline">Current Location</span>
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
          {error}
        </div>
      )}

      {/* Search results dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={result.place_id}
              onClick={() => handleResultSelect(result)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="font-medium text-gray-900 truncate">
                {result.display_name}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {result.lat.toFixed(6)}, {result.lon.toFixed(6)}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {isOpen && results.length === 0 && query.length >= 3 && !isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
          No addresses found for "{query}"
        </div>
      )}
    </div>
  );
}

// Simplified version for basic use cases
export function SimpleAddressSearch({
  onLocationSelect,
  placeholder = "Enter an address",
  className = "",
}: {
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <AddressSearch
      onLocationSelect={onLocationSelect}
      placeholder={placeholder}
      className={className}
      showCurrentLocationButton={true}
      restrictToFlorida={false}
    />
  );
} 