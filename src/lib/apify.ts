/**
 * Apify API client for Next.js
 */

import { LawnCareProvider } from '@/types';

const APIFY_API_URL = process.env.NEXT_PUBLIC_APIFY_API_URL || 'https://api.apify.com/v2/datasets/nm5boC2OslxFiqviz/items';
const APIFY_TOKEN = process.env.NEXT_PUBLIC_APIFY_TOKEN;
/**
 * Fetches lawn care providers from the Apify API
 * @returns Promise with the providers data
 */
export async function fetchProvidersFromApify(): Promise<LawnCareProvider[]> {
  try {
    const url = new URL(APIFY_API_URL);
    url.searchParams.append('token', APIFY_TOKEN as string);
    
    const res = await fetch(url.toString(), {
      next: { 
        revalidate: false // Never revalidate (cache forever)
      } 
    });
    
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Apify API fetch error:", error);
    return [];
  }
}

/**
 * Check if a provider is featured
 */
export function isProviderFeatured(provider: LawnCareProvider, featuredIds: string[]): boolean {
  return featuredIds.includes(provider.placeId);
}

/**
 * Get a provider's main image URL
 */
export function getProviderMainImage(provider: LawnCareProvider): string | null {
  return provider.imageUrl || (provider.imageUrls?.length ? provider.imageUrls[0] : null);
}

/**
 * Get a provider's social media links
 */
export function getProviderSocials(provider: LawnCareProvider) {
  return {
    instagram: provider.instagrams?.length ? provider.instagrams[0] : null,
    twitter: provider.twitters?.length ? provider.twitters[0] : null,
    facebook: provider.facebooks?.length ? provider.facebooks[0] : null,
    youtube: provider.youtubes?.length ? provider.youtubes[0] : null,
    tiktok: provider.tiktoks?.length ? provider.tiktoks[0] : null,
  };
} 