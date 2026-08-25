import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import LegalLayout from '@/components/LegalLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });
  return { title: t('title') };
}

const CONTENT: Record<string, { title: string; sections: { heading: string; body: string }[] }> = {
  fr: {
    title: 'Mentions légales',
    sections: [
      { heading: 'Éditeur du site', body: 'LitigeFlow SAS  Société par Actions Simplifiée au capital de 10 000 €\nSiège social : [Adresse complète], France\nRCS : [Numéro RCS]\nSIRET : [Numéro SIRET]\nTVA intracommunautaire : FR[Numéro TVA]\nDirecteur de la publication : [Nom du dirigeant]' },
      { heading: 'Contact', body: 'E-mail : contact@litigeflow.com\nTéléphone : +33 (0)1 23 45 67 89\nHoraires : Lundi–Vendredi, 9h–18h (CET)' },
      { heading: 'Hébergement', body: 'Le site est hébergé par Vercel Inc., 340 Pine Street, Suite 900, San Francisco, CA 94104, USA.\nBase de données hébergée sur infrastructure PostgreSQL managée (Neon/Supabase).' },
      { heading: 'Propriété intellectuelle', body: 'L\'ensemble des contenus présents sur ce site (textes, images, logos, code source) est protégé par le droit d\'auteur et appartient à LitigeFlow SAS ou à ses partenaires. Toute reproduction est interdite sans autorisation préalable.' },
      { heading: 'Médiation', body: 'Conformément à l\'article L.616-1 du Code de la consommation, LitigeFlow propose un dispositif de médiation de la consommation. En cas de litige non résolu, vous pouvez saisir le médiateur compétent.' },
      { heading: 'Loi applicable', body: 'Le présent site est soumis au droit français. Tout litige relatif à son utilisation sera soumis à la compétence exclusive des tribunaux français.' },
    ],
  },
  en: {
    title: 'Legal Notice',
    sections: [
      { heading: 'Publisher', body: 'LitigeFlow SAS  Simplified Joint Stock Company\nRegistered office: [Full address], France\nCompany registration: [Registration number]\nPublication director: [Director name]' },
      { heading: 'Contact', body: 'Email: contact@litigeflow.com\nPhone: +33 (0)1 23 45 67 89\nHours: Monday–Friday, 9am–6pm (CET)' },
      { heading: 'Hosting', body: 'This site is hosted by Vercel Inc., 340 Pine Street, Suite 900, San Francisco, CA 94104, USA.\nDatabase hosted on managed PostgreSQL infrastructure.' },
      { heading: 'Intellectual Property', body: 'All content on this site (texts, images, logos, source code) is protected by copyright and belongs to LitigeFlow SAS or its partners. Any reproduction is prohibited without prior authorization.' },
      { heading: 'Dispute Resolution', body: 'In case of unresolved dispute, you may contact the competent consumer mediator or use the EU Online Dispute Resolution platform: ec.europa.eu/consumers/odr' },
      { heading: 'Governing Law', body: 'This site is subject to French law. Any dispute relating to its use will be submitted to the exclusive jurisdiction of French courts.' },
    ],
  },
  es: {
    title: 'Aviso legal',
    sections: [
      { heading: 'Editor', body: 'LitigeFlow SAS  Sociedad por Acciones Simplificada\nDomicilio social: [Dirección completa], Francia' },
      { heading: 'Contacto', body: 'Email: contact@litigeflow.com\nTeléfono: +33 (0)1 23 45 67 89' },
      { heading: 'Alojamiento', body: 'Este sitio está alojado por Vercel Inc., San Francisco, CA, EE.UU.' },
      { heading: 'Propiedad intelectual', body: 'Todos los contenidos están protegidos por derechos de autor y pertenecen a LitigeFlow SAS.' },
      { heading: 'Resolución de disputas', body: 'En caso de disputa no resuelta, puede contactar al mediador de consumo competente o usar la plataforma ODR de la UE.' },
      { heading: 'Ley aplicable', body: 'Este sitio está sujeto a la ley francesa.' },
    ],
  },
  de: {
    title: 'Impressum',
    sections: [
      { heading: 'Herausgeber', body: 'LitigeFlow SAS  Vereinfachte Aktiengesellschaft\nEingetragener Sitz: [Vollständige Adresse], Frankreich' },
      { heading: 'Kontakt', body: 'E-Mail: contact@litigeflow.com\nTelefon: +33 (0)1 23 45 67 89' },
      { heading: 'Hosting', body: 'Diese Website wird von Vercel Inc., San Francisco, CA, USA gehostet.' },
      { heading: 'Geistiges Eigentum', body: 'Alle Inhalte sind urheberrechtlich geschützt und gehören LitigeFlow SAS.' },
      { heading: 'Streitbeilegung', body: 'Bei ungelösten Streitigkeiten können Sie die EU-Online-Streitbeilegungsplattform nutzen: ec.europa.eu/consumers/odr' },
      { heading: 'Anwendbares Recht', body: 'Diese Website unterliegt französischem Recht.' },
    ],
  },
};

export default async function LegalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = CONTENT[locale] ?? CONTENT.en;
  return <LegalLayout title={content.title} sections={content.sections} />;
}
