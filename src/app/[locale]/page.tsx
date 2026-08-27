import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Disable SSR for HomeClient to prevent hydration mismatch
const HomeClient = dynamic(() => import('@/app/HomeClient'), { 
  ssr: false,
  loading: () => <div className="min-h-screen bg-white" />
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.litigeflow.fr';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  return {
    title: 'LitigeFlow – Refund & Dispute Platform',
    description: t('description'),
    alternates: { canonical: `${siteUrl}/${locale}` },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LitigeFlow',
    url: `${siteUrl}/${locale}`,
    logo: `${siteUrl}/og-image.png`,
    contactPoint: { '@type': 'ContactPoint', contactType: 'customer support' },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
