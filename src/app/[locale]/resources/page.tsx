import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ResourcesClient from './ResourcesClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'resources' });
  return { title: t('title'), description: t('subtitle') };
}

export default function ResourcesPage() {
  return <ResourcesClient />;
}
