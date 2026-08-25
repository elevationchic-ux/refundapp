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
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const ogLocale = OG_LOCALE[locale as Locale] ?? 'fr_FR';

  const title = 'LitigeFlow – Remboursements & Litiges';
  const description = t('description');

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: '%s | LitigeFlow',
    },
    description,
    keywords: [
      'remboursement', 'litige', 'arnaque', 'retard vol', 'chargeback',
      'refund', 'dispute', 'consumer protection', 'Erstattung', 'reembolso',
    ],
    authors: [{ name: 'LitigeFlow', url: siteUrl }],
    creator: 'LitigeFlow',
    publisher: 'LitigeFlow',
    openGraph: {
      type: 'website',
      locale: ogLocale,
      url: `${siteUrl}/${locale}`,
      siteName: 'LitigeFlow',
      title,
      description,
      images: [
        {
          url: '/icons/icon-512x512.png',
          width: 512,
          height: 512,
          alt: 'LitigeFlow Logo',
        },
      ],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: ['/icons/icon-512x512.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        fr: `${siteUrl}/fr`,
        en: `${siteUrl}/en`,
        es: `${siteUrl}/es`,
        de: `${siteUrl}/de`,
        'x-default': `${siteUrl}/fr`,
      },
    },
    manifest: '/api/manifest',
    icons: {
      icon: '/favicon.svg',
      apple: '/apple-touch-icon.png',
      shortcut: '/favicon.svg',
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
      <head>
        <link rel="manifest" href="/api/manifest" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LitigeFlow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
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
