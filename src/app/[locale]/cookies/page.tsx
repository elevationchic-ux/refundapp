import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import LegalLayout from '@/components/LegalLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal.cookies' });
  return { title: t('title') };
}

const CONTENT: Record<string, { title: string; sections: { heading: string; body: string }[] }> = {
  fr: {
    title: 'Politique de cookies',
    sections: [
      { heading: '1. Qu\'est-ce qu\'un cookie ?', body: 'Un cookie est un petit fichier texte déposé sur votre terminal lors de la visite d\'un site web. Il permet de mémoriser des informations relatives à votre navigation.' },
      { heading: '2. Cookies strictement nécessaires', body: 'Ces cookies sont indispensables au fonctionnement du site : session d\'authentification (httpOnly, sécurisé), préférences de langue, panier de services. Ils ne peuvent pas être désactivés.' },
      { heading: '3. Cookies analytiques', body: 'Avec votre consentement, nous utilisons des cookies analytiques (ex. Plausible Analytics, solution respectueuse de la vie privée sans transfert de données hors UE) pour comprendre comment vous utilisez notre site.' },
      { heading: '4. Cookies de paiement', body: 'Stripe dépose des cookies nécessaires au traitement sécurisé des paiements. Ces cookies sont soumis à la politique de confidentialité de Stripe.' },
      { heading: '5. Durée de conservation', body: 'Les cookies de session expirent à la fermeture du navigateur. Les cookies persistants ont une durée maximale de 13 mois conformément aux recommandations de la CNIL.' },
      { heading: '6. Gestion des cookies', body: 'Vous pouvez gérer vos préférences de cookies via le bandeau de consentement affiché lors de votre première visite, ou depuis les paramètres de votre navigateur.' },
    ],
  },
  en: {
    title: 'Cookie Policy',
    sections: [
      { heading: '1. What is a cookie?', body: 'A cookie is a small text file placed on your device when you visit a website. It stores information related to your browsing.' },
      { heading: '2. Strictly necessary cookies', body: 'These cookies are essential for the site to function: authentication session (httpOnly, secure), language preferences, service cart. They cannot be disabled.' },
      { heading: '3. Analytics cookies', body: 'With your consent, we use analytics cookies (e.g. Plausible Analytics, a privacy-respecting solution with no data transfer outside the EU) to understand how you use our site.' },
      { heading: '4. Payment cookies', body: 'Stripe places cookies necessary for secure payment processing. These cookies are subject to Stripe\'s privacy policy.' },
      { heading: '5. Retention period', body: 'Session cookies expire when the browser is closed. Persistent cookies have a maximum duration of 13 months.' },
      { heading: '6. Cookie management', body: 'You can manage your cookie preferences via the consent banner displayed on your first visit, or from your browser settings.' },
    ],
  },
  es: {
    title: 'Política de cookies',
    sections: [
      { heading: '1. ¿Qué es una cookie?', body: 'Una cookie es un pequeño archivo de texto depositado en su dispositivo al visitar un sitio web.' },
      { heading: '2. Cookies estrictamente necesarias', body: 'Esenciales para el funcionamiento del sitio: sesión de autenticación, preferencias de idioma. No pueden desactivarse.' },
      { heading: '3. Cookies analíticas', body: 'Con su consentimiento, utilizamos cookies analíticas para entender cómo usa nuestro sitio.' },
      { heading: '4. Cookies de pago', body: 'Stripe deposita cookies necesarias para el procesamiento seguro de pagos.' },
      { heading: '5. Duración', body: 'Las cookies de sesión expiran al cerrar el navegador. Las persistentes tienen una duración máxima de 13 meses.' },
      { heading: '6. Gestión', body: 'Puede gestionar sus preferencias de cookies a través del banner de consentimiento o la configuración de su navegador.' },
    ],
  },
  de: {
    title: 'Cookie-Richtlinie',
    sections: [
      { heading: '1. Was ist ein Cookie?', body: 'Ein Cookie ist eine kleine Textdatei, die beim Besuch einer Website auf Ihrem Gerät gespeichert wird.' },
      { heading: '2. Notwendige Cookies', body: 'Diese Cookies sind für den Betrieb der Website unerlässlich: Authentifizierungssitzung, Spracheinstellungen. Sie können nicht deaktiviert werden.' },
      { heading: '3. Analyse-Cookies', body: 'Mit Ihrer Einwilligung verwenden wir Analyse-Cookies, um zu verstehen, wie Sie unsere Website nutzen.' },
      { heading: '4. Zahlungs-Cookies', body: 'Stripe setzt Cookies, die für die sichere Zahlungsabwicklung erforderlich sind.' },
      { heading: '5. Aufbewahrungsdauer', body: 'Sitzungs-Cookies laufen beim Schließen des Browsers ab. Persistente Cookies haben eine maximale Dauer von 13 Monaten.' },
      { heading: '6. Verwaltung', body: 'Sie können Ihre Cookie-Einstellungen über das Einwilligungsbanner oder Ihre Browsereinstellungen verwalten.' },
    ],
  },
};

export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = CONTENT[locale] ?? CONTENT.en;
  return <LegalLayout title={content.title} sections={content.sections} lastUpdated="Janvier 2025" />;
}
