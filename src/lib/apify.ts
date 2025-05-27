/**
 * Apify API client for Next.js
 */

import { Provider } from "~/types";

/**
 * Check if a provider is featured
 */
export function isProviderFeatured(provider: Provider, featuredIds: string[]): boolean {
  return featuredIds.includes(provider._id.toString());
}

/**
 * Get a provider's main image URL
 */
export function getProviderMainImage(provider: Provider): string | null {
  return provider.imageUrls[0] || (provider.imageUrls?.length ? provider.imageUrls[0] : null);
}

/**
 * Get a provider's social media links
 */
export function getProviderSocials(provider: Provider) {
  return {
    instagram: provider.socials?.instagram || null,
    twitter: provider.socials?.twitter || null,
    facebook: provider.socials?.facebook || null,
    youtube: provider.socials?.youtube || null,
    tiktok: provider.socials?.tiktok ||null,
  };
} 