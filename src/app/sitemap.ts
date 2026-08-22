import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.litigeflow.fr';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    { url: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { url: '/claim/new', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/faq', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/resources', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/scam-investigation-review', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/login', priority: 0.5, changeFrequency: 'yearly' as const },
    { url: '/register', priority: 0.5, changeFrequency: 'yearly' as const },
  ];

  return routes.map(({ url, priority, changeFrequency }) => ({
    url: `${siteUrl}${url}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
