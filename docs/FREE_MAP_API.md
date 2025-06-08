# Free Map API with Nominatim

This project includes a completely free map solution using Nominatim for geocoding and OpenStreetMap for map tiles. **No API keys required!**

## 🎯 Features

- ✅ **Free geocoding** with Nominatim
- ✅ **Free map tiles** from OpenStreetMap
- ✅ **No API keys** required
- ✅ **No usage limits** (respects Nominatim rate limits)
- ✅ **Address search** with autocomplete
- ✅ **Reverse geocoding** (coordinates to address)
- ✅ **Current location** detection
- ✅ **Interactive maps** with markers
- ✅ **REST API endpoints**
- ✅ **React components** ready to use

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm add leaflet react-leaflet @types/leaflet
```

### 2. Import Components

```tsx
import Map from './components/Map';
import AddressSearch from './components/AddressSearch';
import { mapService } from './lib/map-service';
```

### 3. Basic Usage

```tsx
function MyMapComponent() {
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState([27.7663, -82.6404]); // Florida

  return (
    <div>
      {/* Address Search */}
      <AddressSearch
        onLocationSelect={(lat, lng, address) => {
          setCenter([lat, lng]);
          setMarkers([{
            id: '1',
            lat,
            lng,
            title: 'Selected Location',
            description: address
          }]);
        }}
        placeholder="Search for an address..."
        restrictToFlorida={true}
      />

      {/* Interactive Map */}
      <Map
        center={center}
        zoom={10}
        markers={markers}
        onMapClick={(lat, lng) => {
          // Handle map clicks
          console.log('Clicked:', lat, lng);
        }}
        height="400px"
        enableGeolocation={true}
        showCurrentLocation={true}
      />
    </div>
  );
}
```

## 📍 Map Service API

### Geocoding (Address to Coordinates)

```tsx
import { mapService } from './lib/map-service';

// Basic geocoding
const results = await mapService.geocode('Miami, FL');

// Florida-specific geocoding
const results = await mapService.geocodeInFlorida('Orlando');

// Results format:
// [{
//   lat: 25.7617,
//   lon: -80.1918,
//   display_name: "Miami, Miami-Dade County, Florida, United States",
//   place_id: "123456",
//   osm_type: "relation",
//   osm_id: "123456",
//   boundingbox: ["25.7", "25.8", "-80.2", "-80.1"],
//   importance: 0.8
// }]
```

### Reverse Geocoding (Coordinates to Address)

```tsx
const result = await mapService.reverseGeocode(25.7617, -80.1918);

// Result format:
// {
//   lat: "25.7617",
//   lon: "-80.1918",
//   display_name: "Miami, Miami-Dade County, Florida, United States",
//   address: {
//     city: "Miami",
//     county: "Miami-Dade County",
//     state: "Florida",
//     country: "United States",
//     country_code: "us"
//   }
// }
```

### Current Location

```tsx
const location = await mapService.getCurrentLocation();

// Result format:
// {
//   lat: 25.7617,
//   lng: -80.1918,
//   address: "Miami, Miami-Dade County, Florida, United States"
// }
```

### Search Nearby

```tsx
const results = await mapService.searchNearby(
  25.7617, -80.1918,  // center coordinates
  'restaurant',        // search query
  5                    // radius in km
);
```

### Distance Calculation

```tsx
const distance = mapService.calculateDistance(
  25.7617, -80.1918,  // point 1
  28.5383, -81.3792   // point 2
);
// Returns distance in kilometers
```

## 🗺️ Map Component

### Basic Map

```tsx
<Map
  center={[27.7663, -82.6404]}
  zoom={7}
  height="400px"
/>
```

### Map with Markers

```tsx
const markers = [
  {
    id: 'miami',
    lat: 25.7617,
    lng: -80.1918,
    title: 'Miami',
    description: 'Miami, Florida',
    icon: createCustomIcon({
      iconUrl: 'https://example.com/marker-red.png'
    })
  }
];

<Map
  center={[27.7663, -82.6404]}
  zoom={7}
  markers={markers}
  onMarkerClick={(marker) => {
    console.log('Marker clicked:', marker);
  }}
  onMapClick={(lat, lng) => {
    console.log('Map clicked:', lat, lng);
  }}
/>
```

### Map with Geolocation

```tsx
<Map
  enableGeolocation={true}
  showCurrentLocation={true}
  center={[27.7663, -82.6404]}
  zoom={7}
/>
```

## 🔍 Address Search Component

### Basic Search

```tsx
<AddressSearch
  onLocationSelect={(lat, lng, address) => {
    console.log('Selected:', lat, lng, address);
  }}
  placeholder="Search for an address..."
/>
```

### Florida-Restricted Search

```tsx
<AddressSearch
  onLocationSelect={(lat, lng, address) => {
    // Handle selection
  }}
  restrictToFlorida={true}
  showCurrentLocationButton={true}
  placeholder="Search Florida addresses..."
/>
```

### Simple Search (Minimal)

```tsx
import { SimpleAddressSearch } from './components/AddressSearch';

<SimpleAddressSearch
  onLocationSelect={(lat, lng, address) => {
    // Handle selection
  }}
  placeholder="Enter an address"
/>
```

## 🌐 REST API Endpoints

### Geocoding API

**GET** `/api/map/geocode`

Query Parameters:
- `address` (required): Address to geocode
- `florida` (optional): Set to `true` to restrict to Florida

```bash
# Example
curl "http://localhost:3000/api/map/geocode?address=Miami%2C%20FL&florida=true"
```

**POST** `/api/map/geocode`

Body:
```json
{
  "addresses": ["Miami, FL", "Orlando, FL"],
  "florida": true
}
```

### Reverse Geocoding API

**GET** `/api/map/reverse`

Query Parameters:
- `lat` (required): Latitude
- `lng` (required): Longitude

```bash
# Example
curl "http://localhost:3000/api/map/reverse?lat=25.7617&lng=-80.1918"
```

**POST** `/api/map/reverse`

Body:
```json
{
  "coordinates": [
    {"lat": 25.7617, "lng": -80.1918},
    {"lat": 28.5383, "lng": -81.3792}
  ]
}
```

## 🎨 Custom Icons

```tsx
import { createCustomIcon } from './components/Map';

const redIcon = createCustomIcon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

const markers = [{
  id: '1',
  lat: 25.7617,
  lng: -80.1918,
  title: 'Custom Marker',
  icon: redIcon
}];
```

## 🔧 Configuration

### Rate Limiting

The service automatically respects Nominatim's rate limits (1 request per second):

```tsx
// Rate limiting is handled automatically
const results = await mapService.geocode('Miami, FL');
```

### Florida Bounds

```tsx
import { FLORIDA_BOUNDS, isInFlorida } from './lib/map-service';

// Check if coordinates are in Florida
if (isInFlorida(lat, lng)) {
  console.log('Location is in Florida');
}
```

### Error Handling

```tsx
try {
  const results = await mapService.geocode('Invalid Address');
} catch (error) {
  console.error('Geocoding failed:', error.message);
}
```

## 📱 React Hook

```tsx
import { useMapService } from './components/Map';

function MyComponent() {
  const { geocode, reverseGeocode, getCurrentLocation, isLoading, error } = useMapService();

  const handleSearch = async () => {
    try {
      const results = await geocode('Miami, FL');
      console.log(results);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
```

## 🌟 Use Cases for Lawn Care Directory

### Provider Locations

```tsx
// Show lawn care providers on map
const providerMarkers = providers.map(provider => ({
  id: provider.id,
  lat: provider.latitude,
  lng: provider.longitude,
  title: provider.name,
  description: provider.services.join(', '),
  icon: createCustomIcon({
    iconUrl: '/icons/lawn-mower.png'
  })
}));

<Map markers={providerMarkers} />
```

### Service Area Search

```tsx
// Search for providers in a specific area
<AddressSearch
  onLocationSelect={async (lat, lng, address) => {
    const nearbyProviders = await mapService.searchNearby(
      lat, lng, 'lawn care', 25 // 25km radius
    );
    setProviders(nearbyProviders);
  }}
  restrictToFlorida={true}
  placeholder="Enter your address to find lawn care providers..."
/>
```

### Customer Location Input

```tsx
// Let customers input their location for quotes
<AddressSearch
  onLocationSelect={(lat, lng, address) => {
    setCustomerLocation({ lat, lng, address });
  }}
  placeholder="Enter your property address..."
  restrictToFlorida={true}
/>
```

## 🚀 Demo

Visit `/map-demo` to see a live demo of all features!

## 📝 Notes

- **Rate Limits**: Nominatim allows 1 request per second
- **Attribution**: OpenStreetMap attribution is automatically included
- **Offline**: Maps won't work offline (requires internet for tiles)
- **Accuracy**: Geocoding accuracy depends on OpenStreetMap data quality
- **Coverage**: Global coverage, but quality varies by region

## 🆓 Why This is Completely Free

1. **OpenStreetMap tiles**: Free and open source
2. **Nominatim geocoding**: Free service by OpenStreetMap Foundation
3. **Leaflet**: Open source mapping library
4. **No API keys**: No registration or authentication required
5. **No usage limits**: Only rate limits to be respectful

Perfect for startups, small businesses, and projects that need mapping without the cost! 