import zipcodes from 'zipcodes';
import { Provider } from '~/types';

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

export function filterProvidersByRadius<T extends { address?: { postalCode?: string | null } }>(
  providers: T[],
  zipcode: string,
  radiusInMiles: number
): T[] {
  // Get all zipcodes within the radius
  const zipcodesInRadius = getZipcodesInRadius(zipcode, radiusInMiles);

  if (!zipcodesInRadius.length) return [];

  // Filter providers whose postal code is in the radius
  return providers.filter((provider) => {
    if (!provider) return false;

    const postalCode = provider.address?.postalCode;
    return postalCode ? zipcodesInRadius.includes(postalCode) : false;
  });
}

export function getDistanceBetweenZipcodes(zipcode1: string, zipcode2: string): number {
  return zipcodes.distance(zipcode1, zipcode2);
}
