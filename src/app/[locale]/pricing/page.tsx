import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import PricingClient from './PricingClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function PricingPage() {
  return <PricingClient />;
}
