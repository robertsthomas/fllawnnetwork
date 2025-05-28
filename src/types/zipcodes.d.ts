declare module 'zipcodes' {
  interface ZipcodeInfo {
    zip: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    country: string;
  }

  function lookup(zipcode: string): ZipcodeInfo | null;
  function radius(zipcode: string, radiusInMiles: number): string[];
  function distance(zipcode1: string, zipcode2: string): number;

  export default {
    lookup,
    radius,
    distance,
  };
}
