'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title?: string;
  description?: string;
  icon?: L.Icon;
}

export interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  onMapClick?: (lat: number, lng: number) => void;
  onMarkerClick?: (marker: MapMarker) => void;
  height?: string;
  width?: string;
  className?: string;
  showCurrentLocation?: boolean;
  enableGeolocation?: boolean;
}

// Component to handle map events
function MapEventHandler({ 
  onMapClick, 
  onMarkerClick 
}: { 
  onMapClick?: (lat: number, lng: number) => void;
  onMarkerClick?: (marker: MapMarker) => void;
}) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

// Component to handle geolocation
function GeolocationHandler({ 
  enableGeolocation,
  onLocationFound 
}: { 
  enableGeolocation?: boolean;
  onLocationFound?: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (enableGeolocation) {
      map.locate({ setView: true, maxZoom: 16 });
      
      map.on('locationfound', (e) => {
        if (onLocationFound) {
          onLocationFound(e.latlng.lat, e.latlng.lng);
        }
      });

      map.on('locationerror', (e) => {
        console.warn('Location access denied or unavailable:', e.message);
      });
    }
  }, [map, enableGeolocation, onLocationFound]);

  return null;
}

export default function Map({
  center = [27.7663, -82.6404], // Default to Florida center
  zoom = 7,
  markers = [],
  onMapClick,
  onMarkerClick,
  height = '400px',
  width = '100%',
  className = '',
  showCurrentLocation = false,
  enableGeolocation = false,
}: MapProps) {
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure this only renders on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLocationFound = (lat: number, lng: number) => {
    setCurrentLocation([lat, lng]);
  };

  if (!isClient) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ height, width }}
      >
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className={className} style={{ height, width }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        {/* Free OpenStreetMap tiles - no API key required! */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Event handlers */}
        <MapEventHandler onMapClick={onMapClick} onMarkerClick={onMarkerClick} />
        
        {/* Geolocation handler */}
        {enableGeolocation && (
          <GeolocationHandler 
            enableGeolocation={enableGeolocation}
            onLocationFound={handleLocationFound}
          />
        )}
        
        {/* Current location marker */}
        {showCurrentLocation && currentLocation && (
          <Marker position={currentLocation}>
            <Popup>
              <div>
                <strong>Your Location</strong>
                <br />
                {currentLocation[0].toFixed(6)}, {currentLocation[1].toFixed(6)}
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Custom markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={marker.icon}
            eventHandlers={{
              click: () => onMarkerClick?.(marker),
            }}
          >
            {(marker.title || marker.description) && (
              <Popup>
                <div>
                  {marker.title && <strong>{marker.title}</strong>}
                  {marker.title && marker.description && <br />}
                  {marker.description && <span>{marker.description}</span>}
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

// Custom hook for using the map service
export function useMapService() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocode = async (address: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { mapService } = await import('../lib/map-service');
      const results = await mapService.geocode(address);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Geocoding failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const { mapService } = await import('../lib/map-service');
      const result = await mapService.reverseGeocode(lat, lng);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Reverse geocoding failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { mapService } = await import('../lib/map-service');
      const location = await mapService.getCurrentLocation();
      return location;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get current location';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    geocode,
    reverseGeocode,
    getCurrentLocation,
    isLoading,
    error,
  };
}

// Utility function to create custom icons
export const createCustomIcon = (options: {
  iconUrl: string;
  iconSize?: [number, number];
  iconAnchor?: [number, number];
  popupAnchor?: [number, number];
  shadowUrl?: string;
  shadowSize?: [number, number];
}) => {
  return new L.Icon({
    iconUrl: options.iconUrl,
    iconSize: options.iconSize || [25, 41],
    iconAnchor: options.iconAnchor || [12, 41],
    popupAnchor: options.popupAnchor || [1, -34],
    shadowUrl: options.shadowUrl || 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: options.shadowSize || [41, 41],
  });
}; 