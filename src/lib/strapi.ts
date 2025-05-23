/**
 * Strapi API client for Next.js
 */

interface FetchParams {
  endpoint: string;
  query?: Record<string, string>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
}

/**
 * Fetches data from the Strapi API
 * @param options - The options for the fetch
 * @returns Promise with the requested data
 */
export async function fetchFromAPI<T>({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
}: FetchParams): Promise<T> {
  // Ensure endpoint doesn't start with a slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Use environment variable for Strapi URL with fallback
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const url = new URL(`${STRAPI_URL}/api/${cleanEndpoint}`);

  // Add query parameters if provided
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  try {
    const res = await fetch(url.toString(), { 
      next: { 
        revalidate: 60 // Cache for 60 seconds, adjust as needed
      } 
    });
    
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    
    let data = await res.json();

    // Unwrap response if needed
    if (wrappedByKey && data[wrappedByKey] !== undefined) {
      data = data[wrappedByKey];
    }

    if (wrappedByList && Array.isArray(data) && data.length > 0) {
      data = data[0];
    }

    return data as T;
  } catch (error) {
    console.error("API fetch error:", error);
    // Return empty array or object depending on expected return type
    return (wrappedByList ? {} : []) as T;
  }
}

/**
 * Helper to get all providers from Strapi
 */
export async function getProviders() {
  return fetchFromAPI<any[]>({
    endpoint: "providers",
    wrappedByKey: "data",
  });
}

/**
 * Helper to get a specific provider by ID
 */
export async function getProviderById(id: string) {
  return fetchFromAPI<any>({
    endpoint: `providers/${id}`,
    wrappedByKey: "data",
  });
}

/**
 * Helper to get all categories from Strapi
 */
export async function getCategories() {
  return fetchFromAPI<any[]>({
    endpoint: "categories",
    wrappedByKey: "data",
  });
}

/**
 * Helper to get a specific category by ID
 */
export async function getCategoryById(id: string) {
  return fetchFromAPI<any>({
    endpoint: `categories/${id}`,
    wrappedByKey: "data",
  });
}