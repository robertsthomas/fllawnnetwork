import { MetadataRoute } from 'next';
import { floridaCities } from '~/data/florida-cities';

export default function sitemap(): MetadataRoute.Sitemap {
  // Define all domain variations
  const wwwHttpsDomain = 'https://www.fllawnnetwork.com';
  const nonWwwHttpsDomain = 'https://fllawnnetwork.com';
  const wwwHttpDomain = 'http://www.fllawnnetwork.com';
  const nonWwwHttpDomain = 'http://fllawnnetwork.com';
  
  // Use HTTPS www as the canonical domain
  const baseUrl = wwwHttpsDomain;

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lawn-care`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  const cityRoutes = floridaCities.map((city) => ({
    url: `${baseUrl}/lawn-care/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Add non-www HTTPS routes with lower priority
  const nonWwwHttpsRoutes = [
    {
      url: nonWwwHttpsDomain,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.5,
    },
    {
      url: `${nonWwwHttpsDomain}/about`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    },
    {
      url: `${nonWwwHttpsDomain}/services`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.4,
    },
    {
      url: `${nonWwwHttpsDomain}/contact`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    },
    {
      url: `${nonWwwHttpsDomain}/lawn-care`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.4,
    },
  ];

  const nonWwwHttpsCityRoutes = floridaCities.map((city) => ({
    url: `${nonWwwHttpsDomain}/lawn-care/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.4,
  }));

  // Add HTTP routes with lowest priority
  const httpRoutes = [
    {
      url: wwwHttpDomain,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.3,
    },
    {
      url: `${wwwHttpDomain}/about`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.2,
    },
    {
      url: `${wwwHttpDomain}/services`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.2,
    },
    {
      url: `${wwwHttpDomain}/contact`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.2,
    },
    {
      url: `${wwwHttpDomain}/lawn-care`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.2,
    },
    {
      url: nonWwwHttpDomain,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.3,
    },
    {
      url: `${nonWwwHttpDomain}/about`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.2,
    },
    {
      url: `${nonWwwHttpDomain}/services`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.2,
    },
    {
      url: `${nonWwwHttpDomain}/contact`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.2,
    },
    {
      url: `${nonWwwHttpDomain}/lawn-care`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.2,
    },
  ];

  const httpCityRoutes = [
    ...floridaCities.map((city) => ({
      url: `${wwwHttpDomain}/lawn-care/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.2,
    })),
    ...floridaCities.map((city) => ({
      url: `${nonWwwHttpDomain}/lawn-care/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.2,
    })),
  ];

  return [
    ...staticRoutes,
    ...cityRoutes,
    ...nonWwwHttpsRoutes,
    ...nonWwwHttpsCityRoutes,
    ...httpRoutes,
    ...httpCityRoutes,
  ];
}
