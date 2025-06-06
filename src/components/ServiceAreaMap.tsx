'use client';

import { useEffect, useRef } from 'react';

interface ServiceAreaMapProps {
  address?: {
    street?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
  };
  businessName: string;
}

export default function ServiceAreaMap({ address, businessName }: ServiceAreaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real implementation, you would integrate with Google Maps, Mapbox, or another mapping service
    // For now, we'll create a placeholder map
    if (mapRef.current) {
      // This is a placeholder - in production you'd load an actual map
      const mapContainer = mapRef.current;
      mapContainer.innerHTML = `
        <div class="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100"></div>
          <div class="relative z-10 text-center p-4">
            <div class="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2 animate-pulse"></div>
            <p class="text-sm font-medium text-gray-800">${businessName}</p>
            <p class="text-xs text-gray-600">${address?.city || 'Service Area'}, ${address?.state || 'FL'}</p>
            <div class="mt-2 text-xs text-gray-500">
              <p>Service radius: ~15 miles</p>
            </div>
          </div>
          <div class="absolute inset-0 pointer-events-none">
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-green-400 rounded-full opacity-30 animate-pulse"></div>
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-green-500 rounded-full opacity-50"></div>
          </div>
        </div>
      `;
    }
  }, [address, businessName]);

  return (
    <div className="w-full h-64">
      <div ref={mapRef} className="w-full h-full" />
      <div className="mt-2 text-xs text-gray-600 text-center">
        <p>Interactive map showing service coverage area</p>
        <p className="text-gray-500">
          Serving {address?.city || 'local area'} and surrounding communities
        </p>
      </div>
    </div>
  );
} 