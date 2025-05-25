import zipcodes from 'zipcodes';

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
  return zipcodes.radius(zipcode, radiusInMiles);
}

export function filterProvidersByRadius(
  providers: any[],
  zipcode: string,
  radiusInMiles: number
): any[] {
  // Get all zipcodes within the radius
  const zipcodesInRadius = getZipcodesInRadius(zipcode, radiusInMiles);
  
  // Filter providers whose postal code is in the radius
  return providers.filter(provider => 
    provider.address && provider.address.postalCode && zipcodesInRadius.includes(provider.address.postalCode)
  );
}

export function getDistanceBetweenZipcodes(zipcode1: string, zipcode2: string): number {
  return zipcodes.distance(zipcode1, zipcode2);
} 