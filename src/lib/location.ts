import zipcodes from 'zipcodes';
import { LawnCareProvider } from '@/types';

export interface LocationInfo {
  zip: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
}

export function getLocationInfo(zipcode: string): LocationInfo | null {
  return zipcodes.lookup(zipcode);
}

export function getZipcodesInRadius(zipcode: string, radiusInMiles: number): string[] {
  return zipcodes.radius(zipcode, radiusInMiles) || [];
}

export function filterProvidersByRadius(
  providers: LawnCareProvider[],
  zipcode: string,
  radiusInMiles: number
): LawnCareProvider[] {
  // Get all zipcodes within the radius
  const zipcodesInRadius = getZipcodesInRadius(zipcode, radiusInMiles);
  const zipLocation = zipcodes.lookup(zipcode);
  
  if (!zipLocation) return [];
  
  // Filter providers whose postal code is in the radius or calculate distance by coordinates
  return providers.filter(provider => {
    if (!provider) return false;

    // First check if we have postal code in the radius
    if (provider.postalCode && zipcodesInRadius.includes(provider.postalCode)) {
      return true;
    }
    
    // If we have coordinates, calculate distance
    const providerLocation = provider.location;
    if (providerLocation?.lat && providerLocation?.lng && zipLocation) {
      // Calculate distance using Haversine formula
      const lat1 = zipLocation.latitude;
      const lon1 = zipLocation.longitude;
      const lat2 = providerLocation.lat;
      const lon2 = providerLocation.lng;
      
      // Convert to radians
      const R = 3958.8; // Earth radius in miles
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      return distance <= radiusInMiles;
    }
    
    return false;
  });
}

export function getDistanceBetweenZipcodes(zipcode1: string, zipcode2: string): number {
  return zipcodes.distance(zipcode1, zipcode2);
} 