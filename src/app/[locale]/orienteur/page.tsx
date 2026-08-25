import { getTranslations } from 'next-intl/server';
import OrienteurClient from './OrienteurClient';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'orienteur' });
  
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function OrienteurPage() {
  return <OrienteurClient />;
}
