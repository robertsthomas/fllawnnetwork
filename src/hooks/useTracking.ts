import { usePostHog } from 'posthog-js/react';

export function useTracking() {
  const posthog = usePostHog();

  const trackProviderProfileClick = (
    providerId: string,
    providerName: string,
    source: string,
    additionalProps?: Record<string, any>
  ) => {
    posthog?.capture('provider_profile_click', {
      provider_id: providerId,
      provider_name: providerName,
      source: source, // e.g., 'directory', 'featured', 'search', 'profile_view'
      timestamp: new Date().toISOString(),
      // Additional context about the provider
      provider_rating: additionalProps?.rating,
      provider_review_count: additionalProps?.reviewCount,
      provider_categories: additionalProps?.categories,
      provider_location: additionalProps?.location,
      // User context
      user_location: additionalProps?.userLocation,
      // Interaction context
      interaction_type: additionalProps?.interactionType || 'view', // 'view', 'click', 'contact'
      ...additionalProps,
    });
  };

  const trackProviderContact = (
    providerId: string,
    providerName: string,
    contactMethod: string,
    additionalProps?: Record<string, any>
  ) => {
    posthog?.capture('provider_contact', {
      provider_id: providerId,
      provider_name: providerName,
      contact_method: contactMethod, // 'phone', 'email', 'form', 'website'
      timestamp: new Date().toISOString(),
      ...additionalProps,
    });
  };

  return {
    trackProviderProfileClick,
    trackProviderContact,
  };
}
