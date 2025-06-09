// Free map service using Nominatim for geocoding
// No API keys required!

export interface GeocodingResult {
  lat: number;
  lon: number;
  display_name: string;
  place_id: string;
  osm_type: string;
  osm_id: string;
  boundingbox: [string, string, string, string];
  importance: number;
}

export interface ReverseGeocodingResult {
  lat: string;
  lon: string;
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
}

export interface MapLocation {
  lat: number;
  lng: number;
  address?: string;
  name?: string;
}

class MapService {
  private readonly nominatimBaseUrl = 'https://nominatim.openstreetmap.org';
  private readonly userAgent = 'LawnCareDirectory/1.0';
  
  // Rate limiting: Nominatim allows 1 request per second
  private lastRequestTime = 0;
  private readonly minRequestInterval = 1000; // 1 second

  private async makeRequest(url: string): Promise<any> {
    // Respect rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
      );
    }
    this.lastRequestTime = Date.now();

    const response = await fetch(url, {
      headers: {
        'User-Agent': this.userAgent,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Geocode an address to coordinates
   */
  async geocode(address: string): Promise<GeocodingResult[]> {
    try {
      const encodedAddress = encodeURIComponent(address);
      const url = `${this.nominatimBaseUrl}/search?q=${encodedAddress}&format=json&addressdetails=1&limit=5`;
      
      const results = await this.makeRequest(url);
      
      return results.map((result: any) => ({
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        display_name: result.display_name,
        place_id: result.place_id,
        osm_type: result.osm_type,
        osm_id: result.osm_id,
        boundingbox: result.boundingbox,
        importance: result.importance || 0,
      }));
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error('Failed to geocode address');
    }
  }

  /**
   * Reverse geocode coordinates to address
   */
  async reverseGeocode(lat: number, lon: number): Promise<ReverseGeocodingResult | null> {
    try {
      const url = `${this.nominatimBaseUrl}/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
      
      const result = await this.makeRequest(url);
      
      if (!result) return null;

      return {
        lat: result.lat,
        lon: result.lon,
        display_name: result.display_name,
        address: result.address || {},
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  /**
   * Search for places near a location
   */
  async searchNearby(lat: number, lon: number, query: string, radiusKm: number = 10): Promise<GeocodingResult[]> {
    try {
      const encodedQuery = encodeURIComponent(query);
      // Create a bounding box around the location
      const latDelta = radiusKm / 111; // Rough conversion: 1 degree ≈ 111 km
      const lonDelta = radiusKm / (111 * Math.cos(lat * Math.PI / 180));
      
      const bbox = [
        lon - lonDelta, // min longitude
        lat - latDelta, // min latitude  
        lon + lonDelta, // max longitude
        lat + latDelta  // max latitude
      ].join(',');

      const url = `${this.nominatimBaseUrl}/search?q=${encodedQuery}&format=json&addressdetails=1&limit=10&bounded=1&viewbox=${bbox}`;
      
      const results = await this.makeRequest(url);
      
      return results.map((result: any) => ({
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        display_name: result.display_name,
        place_id: result.place_id,
        osm_type: result.osm_type,
        osm_id: result.osm_id,
        boundingbox: result.boundingbox,
        importance: result.importance || 0,
      }));
    } catch (error) {
      console.error('Nearby search error:', error);
      throw new Error('Failed to search nearby locations');
    }
  }

  /**
   * Get the user's current location (requires browser geolocation permission)
   */
  async getCurrentLocation(): Promise<MapLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          try {
            // Get address for the current location
            const reverseResult = await this.reverseGeocode(lat, lng);
            resolve({
              lat,
              lng,
              address: reverseResult?.display_name,
            });
          } catch (error) {
            // Return coordinates even if reverse geocoding fails
            resolve({ lat, lng });
          }
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  /**
   * Calculate distance between two points in kilometers
   */
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Format address from geocoding result
   */
  formatAddress(result: GeocodingResult | ReverseGeocodingResult): string {
    if ('display_name' in result) {
      return result.display_name;
    }
    return '';
  }

  /**
   * Get Florida-specific geocoding (useful for your lawn care directory)
   */
  async geocodeInFlorida(address: string): Promise<GeocodingResult[]> {
    const floridaAddress = address.includes('Florida') || address.includes('FL') 
      ? address 
      : `${address}, Florida, USA`;
    
    return this.geocode(floridaAddress);
  }
}

// Export singleton instance
export const mapService = new MapService();

// Utility functions
export const formatCoordinates = (lat: number, lon: number): string => {
  return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
};

export const isValidCoordinates = (lat: number, lon: number): boolean => {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
};

// Florida bounding box for filtering results
export const FLORIDA_BOUNDS = {
  north: 31.0,
  south: 24.5,
  east: -80.0,
  west: -87.6,
};

export const isInFlorida = (lat: number, lon: number): boolean => {
  return lat >= FLORIDA_BOUNDS.south && 
         lat <= FLORIDA_BOUNDS.north && 
         lon >= FLORIDA_BOUNDS.west && 
         lon <= FLORIDA_BOUNDS.east;
}; 