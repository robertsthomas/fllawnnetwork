/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://fllawnnetwork.com',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ['/server-sitemap.xml'],
  robotsTxtOptions: {
    additionalSitemaps: ['https://fllawnnetwork.com/server-sitemap.xml'],
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};
