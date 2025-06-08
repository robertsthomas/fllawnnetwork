'use client';

import { useState } from 'react';
import Map, { type MapMarker, createCustomIcon } from '../../components/Map';
import AddressSearch, { SimpleAddressSearch } from '../../components/AddressSearch';
import { type GeocodingResult } from '../../lib/map-service';

export default function MapDemoPage() {
  const [mapCenter, setMapCenter] = useState<[number, number]>([27.7663, -82.6404]); // Florida center
  const [mapZoom, setMapZoom] = useState(7);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  // Handle address selection from search
  const handleAddressSelect = (result: GeocodingResult) => {
    const newMarker: MapMarker = {
      id: result.place_id,
      lat: result.lat,
      lng: result.lon,
      title: 'Search Result',
      description: result.display_name,
    };

    setMapCenter([result.lat, result.lon]);
    setMapZoom(15);
    setMarkers([newMarker]);
    setSelectedLocation(result.display_name);
  };

  // Handle location selection (simplified)
  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    const newMarker: MapMarker = {
      id: `location-${Date.now()}`,
      lat,
      lng,
      title: 'Selected Location',
      description: address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    };

    setMapCenter([lat, lng]);
    setMapZoom(15);
    setMarkers([newMarker]);
    setSelectedLocation(address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
  };

  // Handle map clicks
  const handleMapClick = (lat: number, lng: number) => {
    const newMarker: MapMarker = {
      id: `click-${Date.now()}`,
      lat,
      lng,
      title: 'Clicked Location',
      description: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    };

    setMarkers(prev => [...prev, newMarker]);
  };

  // Handle marker clicks
  const handleMarkerClick = (marker: MapMarker) => {
    alert(`Marker clicked: ${marker.title}\n${marker.description}`);
  };

  // Add some sample Florida locations
  const addSampleLocations = () => {
    const sampleLocations: MapMarker[] = [
      {
        id: 'miami',
        lat: 25.7617,
        lng: -80.1918,
        title: 'Miami',
        description: 'Miami, Florida',
        icon: createCustomIcon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        }),
      },
      {
        id: 'orlando',
        lat: 28.5383,
        lng: -81.3792,
        title: 'Orlando',
        description: 'Orlando, Florida',
        icon: createCustomIcon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        }),
      },
      {
        id: 'tampa',
        lat: 27.9506,
        lng: -82.4572,
        title: 'Tampa',
        description: 'Tampa, Florida',
        icon: createCustomIcon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
        }),
      },
      {
        id: 'jacksonville',
        lat: 30.3322,
        lng: -81.6557,
        title: 'Jacksonville',
        description: 'Jacksonville, Florida',
        icon: createCustomIcon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
        }),
      },
    ];

    setMarkers(sampleLocations);
    setMapCenter([27.7663, -82.6404]);
    setMapZoom(7);
  };

  // Clear all markers
  const clearMarkers = () => {
    setMarkers([]);
    setSelectedLocation('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Free Map API Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            This demo showcases a completely free map solution using Nominatim for geocoding 
            and OpenStreetMap for map tiles. No API keys required!
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🗺️ Free Map Tiles
            </h3>
            <p className="text-gray-600">
              Uses OpenStreetMap tiles - completely free with no API key required
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              📍 Free Geocoding
            </h3>
            <p className="text-gray-600">
              Powered by Nominatim for address search and reverse geocoding
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🎯 Interactive Features
            </h3>
            <p className="text-gray-600">
              Click on map, search addresses, get current location, and more
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Search & Controls</h2>
          
          {/* Address Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search for an address:
            </label>
            <AddressSearch
              onAddressSelect={handleAddressSelect}
              placeholder="Try searching for 'Miami, FL' or any address..."
              className="max-w-md"
              restrictToFlorida={true}
            />
          </div>

          {/* Simple Address Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Simple address search:
            </label>
            <SimpleAddressSearch
              onLocationSelect={handleLocationSelect}
              placeholder="Enter any location..."
              className="max-w-md"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={addSampleLocations}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Sample Florida Cities
            </button>
            <button
              onClick={clearMarkers}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Clear All Markers
            </button>
            <button
              onClick={() => {
                setMapCenter([27.7663, -82.6404]);
                setMapZoom(7);
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Reset View to Florida
            </button>
          </div>

          {/* Selected Location Display */}
          {selectedLocation && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Selected Location:</strong> {selectedLocation}
              </p>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Interactive Map</h2>
          <p className="text-gray-600 mb-4">
            Click anywhere on the map to add a marker. Use the search above to find specific locations.
          </p>
          
          <Map
            center={mapCenter}
            zoom={mapZoom}
            markers={markers}
            onMapClick={handleMapClick}
            onMarkerClick={handleMarkerClick}
            height="500px"
            className="rounded-lg overflow-hidden border border-gray-200"
            showCurrentLocation={true}
            enableGeolocation={true}
          />
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Use This in Your Project</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">1. Install Dependencies</h3>
              <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                pnpm add leaflet react-leaflet @types/leaflet
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">2. Import Components</h3>
              <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                {`import Map from './components/Map';
import AddressSearch from './components/AddressSearch';
import { mapService } from './lib/map-service';`}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">3. Use in Your Component</h3>
              <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                {`<AddressSearch onLocationSelect={(lat, lng, address) => {
  // Handle location selection
}} />

<Map
  center={[lat, lng]}
  markers={markers}
  onMapClick={(lat, lng) => {
    // Handle map clicks
  }}
/>`}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-lg font-medium text-green-800 mb-2">✅ Completely Free!</h4>
            <ul className="text-green-700 space-y-1">
              <li>• No API keys required</li>
              <li>• No usage limits (respects Nominatim rate limits)</li>
              <li>• Open source components</li>
              <li>• Perfect for lawn care service areas, provider locations, etc.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 