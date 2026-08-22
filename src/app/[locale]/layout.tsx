import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

type Locale = 'fr' | 'en' | 'es' | 'de';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.litigeflow.fr';

const OG_LOCALE: Record<Locale, string> = {
  fr: 'fr_FR', en: 'en_US', es: 'es_ES', de: 'de_DE',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  const ogLocale = OG_LOCALE[locale as Locale] ?? 'fr_FR';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: 'LitigeFlow – Refund & Dispute Platform',
      template: '%s | LitigeFlow',
    },
    description: t('description'),
    openGraph: {
      type: 'website',
      locale: ogLocale,
      url: `${siteUrl}/${locale}`,
      siteName: 'LitigeFlow',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'LitigeFlow' }],
    },
    twitter: { card: 'summary_large_image', images: ['/og-image.png'] },
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        'fr': `${siteUrl}/fr`,
        'en': `${siteUrl}/en`,
        'es': `${siteUrl}/es`,
        'de': `${siteUrl}/de`,
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Navigation />
          <main className="pt-16">{children}</main>
          <Footer />
          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
