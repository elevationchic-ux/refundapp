import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import LegalLayout from '@/components/LegalLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal.terms' });
  return { title: t('title') };
}

const CONTENT: Record<string, { title: string; sections: { heading: string; body: string }[] }> = {
  fr: {
    title: 'Conditions Générales d\'Utilisation',
    sections: [
      { heading: '1. Objet', body: 'Les présentes CGU régissent l\'utilisation de la plateforme LitigeFlow, service de gestion des remboursements et litiges accessible sur litigeflow.com.' },
      { heading: '2. Acceptation', body: 'L\'utilisation de la plateforme implique l\'acceptation pleine et entière des présentes CGU. Si vous n\'acceptez pas ces conditions, veuillez ne pas utiliser nos services.' },
      { heading: '3. Services proposés', body: 'LitigeFlow propose : orientation vers les recours légaux, dépôt et suivi de dossiers de litige, mise en relation avec des partenaires juridiques, outils d\'estimation de remboursement.' },
      { heading: '4. Inscription et compte', body: 'L\'inscription est gratuite. Vous êtes responsable de la confidentialité de vos identifiants. Toute utilisation frauduleuse doit être signalée immédiatement.' },
      { heading: '5. Obligations de l\'utilisateur', body: 'Vous vous engagez à : fournir des informations exactes, ne pas utiliser la plateforme à des fins frauduleuses, respecter les droits des tiers, ne pas tenter de contourner les mesures de sécurité.' },
      { heading: '6. Tarification', body: 'Le plan Gratuit est sans frais. Le plan Pro prélève une commission de 20% sur les montants effectivement récupérés. Le plan Premium est facturé 49€/mois. Les tarifs sont susceptibles d\'évoluer avec préavis de 30 jours.' },
      { heading: '7. Responsabilité', body: 'LitigeFlow est une plateforme d\'intermédiation. Nous ne garantissons pas le succès de chaque dossier. Notre responsabilité est limitée au montant des sommes versées pour nos services.' },
      { heading: '8. Propriété intellectuelle', body: 'Tous les contenus de la plateforme (textes, logos, code) sont la propriété exclusive de LitigeFlow et protégés par le droit de la propriété intellectuelle.' },
      { heading: '9. Résiliation', body: 'Vous pouvez résilier votre compte à tout moment depuis votre espace client. LitigeFlow se réserve le droit de suspendre tout compte en cas de violation des CGU.' },
      { heading: '10. Droit applicable', body: 'Les présentes CGU sont soumises au droit français. Tout litige sera soumis aux tribunaux compétents de Paris, sauf disposition légale contraire.' },
    ],
  },
  en: {
    title: 'Terms of Service',
    sections: [
      { heading: '1. Purpose', body: 'These Terms of Service govern the use of the LitigeFlow platform, a refund and dispute management service accessible at litigeflow.com.' },
      { heading: '2. Acceptance', body: 'Using the platform implies full acceptance of these Terms. If you do not accept these terms, please do not use our services.' },
      { heading: '3. Services', body: 'LitigeFlow offers: legal remedy guidance, case filing and tracking, referral to legal partners, refund estimation tools.' },
      { heading: '4. Account', body: 'Registration is free. You are responsible for the confidentiality of your credentials. Any fraudulent use must be reported immediately.' },
      { heading: '5. User Obligations', body: 'You agree to: provide accurate information, not use the platform for fraudulent purposes, respect third-party rights, not attempt to circumvent security measures.' },
      { heading: '6. Pricing', body: 'The Free plan is at no cost. The Pro plan charges a 20% commission on amounts actually recovered. The Premium plan is billed at $49/month. Prices may change with 30 days notice.' },
      { heading: '7. Liability', body: 'LitigeFlow is an intermediary platform. We do not guarantee the success of each case. Our liability is limited to amounts paid for our services.' },
      { heading: '8. Intellectual Property', body: 'All platform content (texts, logos, code) is the exclusive property of LitigeFlow and protected by intellectual property law.' },
      { heading: '9. Termination', body: 'You may terminate your account at any time from your client area. LitigeFlow reserves the right to suspend any account in case of Terms violation.' },
      { heading: '10. Governing Law', body: 'These Terms are governed by French law. Any dispute will be submitted to the competent courts of Paris, unless otherwise required by law.' },
    ],
  },
  es: {
    title: 'Términos de Servicio',
    sections: [
      { heading: '1. Objeto', body: 'Estos Términos rigen el uso de la plataforma LitigeFlow, servicio de gestión de reembolsos y litigios.' },
      { heading: '2. Aceptación', body: 'El uso de la plataforma implica la aceptación plena de estos Términos.' },
      { heading: '3. Servicios', body: 'LitigeFlow ofrece: orientación legal, presentación y seguimiento de reclamaciones, herramientas de estimación de reembolso.' },
      { heading: '4. Cuenta', body: 'El registro es gratuito. Usted es responsable de la confidencialidad de sus credenciales.' },
      { heading: '5. Obligaciones', body: 'Se compromete a proporcionar información veraz y no utilizar la plataforma con fines fraudulentos.' },
      { heading: '6. Precios', body: 'Plan Gratis sin coste. Plan Pro: 20% de comisión sobre lo recuperado. Plan Premium: 49€/mes.' },
      { heading: '7. Responsabilidad', body: 'LitigeFlow es una plataforma intermediaria. No garantizamos el éxito de cada caso.' },
      { heading: '8. Propiedad intelectual', body: 'Todos los contenidos son propiedad exclusiva de LitigeFlow.' },
      { heading: '9. Rescisión', body: 'Puede cancelar su cuenta en cualquier momento desde su área de cliente.' },
      { heading: '10. Ley aplicable', body: 'Estos Términos se rigen por la ley francesa. Cualquier disputa se someterá a los tribunales de París.' },
    ],
  },
  de: {
    title: 'Nutzungsbedingungen',
    sections: [
      { heading: '1. Gegenstand', body: 'Diese Nutzungsbedingungen regeln die Nutzung der LitigeFlow-Plattform, einem Erstattungs- und Streitverwaltungsdienst.' },
      { heading: '2. Annahme', body: 'Die Nutzung der Plattform impliziert die vollständige Annahme dieser Bedingungen.' },
      { heading: '3. Dienste', body: 'LitigeFlow bietet: Rechtsmittelberatung, Falleinreichung und -verfolgung, Erstattungsschätzungstools.' },
      { heading: '4. Konto', body: 'Die Registrierung ist kostenlos. Sie sind für die Vertraulichkeit Ihrer Zugangsdaten verantwortlich.' },
      { heading: '5. Nutzerpflichten', body: 'Sie verpflichten sich, genaue Informationen bereitzustellen und die Plattform nicht für betrügerische Zwecke zu nutzen.' },
      { heading: '6. Preise', body: 'Kostenloser Plan ohne Gebühren. Pro-Plan: 20% Provision auf tatsächlich zurückgeholte Beträge. Premium-Plan: 49€/Monat.' },
      { heading: '7. Haftung', body: 'LitigeFlow ist eine Vermittlungsplattform. Wir garantieren nicht den Erfolg jedes Falls.' },
      { heading: '8. Geistiges Eigentum', body: 'Alle Plattforminhalte sind ausschließliches Eigentum von LitigeFlow.' },
      { heading: '9. Kündigung', body: 'Sie können Ihr Konto jederzeit aus Ihrem Kundenbereich kündigen.' },
      { heading: '10. Anwendbares Recht', body: 'Diese Bedingungen unterliegen französischem Recht. Streitigkeiten werden den zuständigen Gerichten in Paris vorgelegt.' },
    ],
  },
};

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = CONTENT[locale] ?? CONTENT.en;
  return <LegalLayout title={content.title} sections={content.sections} lastUpdated="Janvier 2025" />;
}
