"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProvidersFromApify } from "@/lib/apify";
import { LawnCareProvider } from "@/types";

export function useProviders() {
  return useQuery({
    queryKey: ["providers"],
    queryFn: async (): Promise<LawnCareProvider[]> => {
      const data = await fetchProvidersFromApify();
      return data;
    },
    staleTime: Infinity, // Cache data forever as requested
  });
}

export function useProvider(id: string) {
  const { data: providers } = useProviders();
  
  return useQuery({
    queryKey: ["provider", id],
    queryFn: (): LawnCareProvider | undefined => {
      return providers?.find(provider => provider.placeId === id);
    },
    enabled: !!providers,
    staleTime: Infinity, // Cache data forever
  });
} 