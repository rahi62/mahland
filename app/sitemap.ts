import type { MetadataRoute } from 'next';
import { articles, villas } from '@/lib/content';
import { siteUrl } from '@/lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '',
    '/about',
    '/architecture',
    '/villas',
    '/gallery',
    '/progress',
    '/masterplan',
    '/location',
    '/contact',
    '/journal',
    ...villas.map((villa) => `/villas/${villa.slug}`),
    ...articles.map((article) => `/journal/${article.slug}`),
  ];

  return paths.map((path) => ({ url: `${siteUrl}${path}` }));
}
