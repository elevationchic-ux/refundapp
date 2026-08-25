import { getTranslations } from 'next-intl/server';
import CalculatorClient from './CalculatorClient';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'calculator' });
  
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function CalculatorPage() {
  return <CalculatorClient />;
}
