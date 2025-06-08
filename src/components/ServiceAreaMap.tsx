'use client';

import { useEffect, useState } from 'react';
import Map, { type MapMarker, createCustomIcon } from './Map';
import { mapService, type GeocodingResult } from '../lib/map-service';

interface ServiceAreaMapProps {
  address?: {
    street?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
  };
  businessName: string;
  serviceRadius?: number; // in kilometers, default 24km (~15 miles)
  showServiceRadius?: boolean;
  height?: string;
}

export default function ServiceAreaMap({ 
  address, 
  businessName, 
  serviceRadius = 24, // ~15 miles
  showServiceRadius = true,
  height = "300px"
}: ServiceAreaMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([27.7663, -82.6404]); // Default to Florida center
  const [mapZoom, setMapZoom] = useState(10);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create business location marker
  useEffect(() => {
    const geocodeBusinessLocation = async () => {
      if (!address?.city && !address?.street) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Build address string
        const addressParts = [
          address.street,
          address.city,
          address.state || 'FL',
          address.postalCode
        ].filter(Boolean);
        
        const fullAddress = addressParts.join(', ');
        
        // Geocode the business address
        const results = await mapService.geocodeInFlorida(fullAddress);
        
        if (results.length > 0) {
          const location = results[0];
          
          // Create business marker with custom icon
          const businessMarker: MapMarker = {
            id: 'business-location',
            lat: location.lat,
            lng: location.lon,
            title: businessName,
            description: `${businessName}\n${location.display_name}`,
            icon: createCustomIcon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
              iconSize: [30, 45],
              iconAnchor: [15, 45],
              popupAnchor: [1, -34]
            })
          };

          setMapCenter([location.lat, location.lon]);
          setMapZoom(12);
          setMarkers([businessMarker]);
        } else {
          setError('Could not find location for the provided address');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load business location');
        console.error('Geocoding error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    geocodeBusinessLocation();
  }, [address, businessName]);

  // Handle map clicks to show service area coverage
  const handleMapClick = async (lat: number, lng: number) => {
    if (markers.length === 0) return;

    const businessLocation = markers[0];
    const distance = mapService.calculateDistance(
      businessLocation.lat,
      businessLocation.lng,
      lat,
      lng
    );

    // Check if clicked location is within service area
    const isInServiceArea = distance <= serviceRadius;
    
    try {
      // Get address for clicked location
      const reverseResult = await mapService.reverseGeocode(lat, lng);
      const clickedAddress = reverseResult?.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

      // Create marker for clicked location
      const clickMarker: MapMarker = {
        id: `click-${Date.now()}`,
        lat,
        lng,
        title: isInServiceArea ? 'Within Service Area' : 'Outside Service Area',
        description: `${clickedAddress}\nDistance: ${distance.toFixed(1)} km\n${isInServiceArea ? '✅ Service Available' : '❌ Outside Service Area'}`,
        icon: createCustomIcon({
          iconUrl: isInServiceArea 
            ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png'
            : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        })
      };

      // Update markers to include business location and clicked location
      setMarkers([markers[0], clickMarker]);
    } catch (err) {
      console.error('Reverse geocoding error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full" style={{ height }}>
        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading service area map...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full" style={{ height }}>
        <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-800 mb-1">{businessName}</p>
            <p className="text-xs text-gray-600 mb-2">
              {address?.city || 'Service Area'}, {address?.state || 'FL'}
            </p>
            <p className="text-xs text-gray-500">Service radius: ~{Math.round(serviceRadius * 0.621)} miles</p>
            <p className="text-xs text-red-600 mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Service Area Info */}
      <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-green-800">{businessName} Service Area</h4>
            <p className="text-xs text-green-600">
              Serving {address?.city || 'local area'} and surrounding communities
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-green-700 font-medium">
              ~{Math.round(serviceRadius * 0.621)} mile radius
            </p>
            <p className="text-xs text-green-600">
              {serviceRadius} km coverage
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="relative">
        <Map
          center={mapCenter}
          zoom={mapZoom}
          markers={markers}
          onMapClick={handleMapClick}
          height={height}
          className="rounded-lg overflow-hidden border border-gray-200"
        />
        
        {/* Map Instructions */}
        <div className="absolute top-2 left-2 bg-white bg-opacity-90 rounded-lg p-2 shadow-sm">
          <p className="text-xs text-gray-700">
            📍 Click anywhere to check service availability
          </p>
        </div>
      </div>

      {/* Service Area Legend */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-700">Business Location</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-700">Within Service Area</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-700">Outside Service Area</span>
        </div>
      </div>

      {/* Service Coverage Details */}
      <div className="mt-3 text-xs text-gray-600 text-center">
        <p>Interactive map showing actual service coverage area</p>
        <p className="text-gray-500">
          Click on the map to check if a location is within the service area
        </p>
      </div>
    </div>
  );
} 