import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import TrackerClient from './TrackerClient';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'tracker' });
  
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function TrackerPage() {
  return <TrackerClient />;
}
