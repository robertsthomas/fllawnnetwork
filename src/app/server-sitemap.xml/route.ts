import { getServerSideSitemap } from 'next-sitemap';

type Changefreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export async function GET(request: Request) {
  // You can fetch dynamic routes from your database or API here
  const fields = [
    {
      loc: 'https://fllawnnetwork.com',
      lastmod: new Date().toISOString(),
      changefreq: 'daily' as Changefreq,
      priority: 1.0,
    },
    {
      loc: 'https://fllawnnetwork.com/about',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly' as Changefreq,
      priority: 0.8,
    },
    {
      loc: 'https://fllawnnetwork.com/services',
      lastmod: new Date().toISOString(),
      changefreq: 'daily' as Changefreq,
      priority: 0.9,
    },
    {
      loc: 'https://fllawnnetwork.com/contact',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly' as Changefreq,
      priority: 0.8,
    },
    {
      loc: 'https://fllawnnetwork.com/directory',
      lastmod: new Date().toISOString(),
      changefreq: 'daily' as Changefreq,
      priority: 0.9,
    },
  ];

  return getServerSideSitemap(fields);
}
