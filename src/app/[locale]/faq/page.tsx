import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import FAQClient from './FAQClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.litigeflow.fr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faq' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: { canonical: `${siteUrl}/${locale}/faq` },
  };
}

const FAQS: Record<string, { question: string; answer: string }[]> = {
  fr: [
    { question: 'Comment fonctionne la procédure de remboursement sur LitigeFlow ?', answer: 'Vous déposez votre dossier en 3 étapes : description du litige, upload des preuves, récapitulatif. Nos agents examinent votre dossier sous 24 h et vous orientent vers le recours le plus adapté.' },
    { question: 'Quels types de litiges pouvez-vous traiter ?', answer: 'Litiges marchands, retards/annulations de vols (jusqu\'à 600 € via CE 261/2004), arnaques en ligne, chargebacks bancaires, litiges transfrontaliers européens, remboursements santé et fiscaux.' },
    { question: 'Combien coûte le service LitigeFlow ?', answer: 'Le dépôt de dossier et l\'orientation sont gratuits. Plan Pro : 20% de commission sur le montant récupéré. Plan Premium : 49€/mois. Aucune avance de frais.' },
    { question: 'Qu\'est-ce qu\'un chargeback ?', answer: 'Le chargeback est une contestation de débit auprès de votre banque. Vous disposez généralement de 120 jours après la transaction pour le demander.' },
    { question: 'Combien puis-je obtenir pour un vol retardé ?', answer: 'Le règlement CE 261/2004 prévoit 250 € (< 1 500 km), 400 € (intra-UE > 1 500 km) ou 600 € (> 3 500 km). Le retard doit dépasser 3 heures.' },
    { question: 'Mes données personnelles sont-elles sécurisées ?', answer: 'Oui. Vos pièces sont chiffrées et accessibles uniquement par vous et les agents assignés. Nous respectons le RGPD. Aucune donnée n\'est revendue.' },
    { question: 'Puis-je suivre l\'avancement de mon dossier ?', answer: 'Oui, depuis votre tableau de bord client. Chaque changement de statut vous est notifié en temps réel.' },
    { question: 'Que faire si le marchand est dans un autre pays de l\'UE ?', answer: 'Contactez Europe Consommateurs (europe-consommateurs.eu), service gratuit. Vous pouvez aussi déposer votre dossier sur LitigeFlow.' },
  ],
  en: [
    { question: 'How does the refund process work on LitigeFlow?', answer: 'You file your case in 3 steps: dispute description, evidence upload, summary. Our agents review your case within 24 hours and direct you to the most appropriate remedy.' },
    { question: 'What types of disputes can you handle?', answer: 'Merchant disputes, flight delays/cancellations (up to €600 via EC 261/2004), online scams, bank chargebacks, cross-border EU disputes, healthcare and tax refunds.' },
    { question: 'How much does LitigeFlow cost?', answer: 'Case filing and guidance are free. Pro plan: 20% commission on recovered amounts. Premium plan: $49/month. No upfront fees.' },
    { question: 'What is a chargeback?', answer: 'A chargeback is a debit dispute with your bank. You generally have 120 days from the transaction to request one.' },
    { question: 'How much can I get for a delayed flight?', answer: 'EC Regulation 261/2004 provides €250 (< 1,500 km), €400 (intra-EU > 1,500 km) or €600 (> 3,500 km). The delay must exceed 3 hours.' },
    { question: 'Is my personal data secure?', answer: 'Yes. Your documents are encrypted and accessible only by you and assigned agents. We comply with GDPR, CCPA, and PIPEDA.' },
    { question: 'Can I track my case progress?', answer: 'Yes, from your client dashboard. Every status change is notified in real time.' },
    { question: 'What if the merchant is in another EU country?', answer: 'Contact Europe Consumers (europe-consommateurs.eu), a free official service. You can also file your case on LitigeFlow.' },
  ],
  es: [
    { question: '¿Cómo funciona el proceso de reembolso en LitigeFlow?', answer: 'Presenta tu caso en 3 pasos: descripción, pruebas, resumen. Nuestros agentes lo revisan en 24 horas.' },
    { question: '¿Qué tipos de litigios gestionan?', answer: 'Litigios con comerciantes, retrasos/cancelaciones de vuelos (hasta 600 € vía CE 261/2004), estafas online, contracargos bancarios y litigios transfronterizos.' },
    { question: '¿Cuánto cuesta LitigeFlow?', answer: 'La presentación es gratuita. Plan Pro: 20% de comisión sobre lo recuperado. Plan Premium: 49€/mes. Sin costes anticipados.' },
    { question: '¿Qué es un contracargo?', answer: 'Un contracargo es una disputa de débito con tu banco. Generalmente tienes 120 días desde la transacción.' },
    { question: '¿Cuánto puedo obtener por un vuelo retrasado?', answer: 'El Reglamento CE 261/2004 prevé 250 €, 400 € o 600 € según la distancia del vuelo.' },
    { question: '¿Están seguros mis datos?', answer: 'Sí. Tus documentos están cifrados y solo accesibles por ti y los agentes asignados. Cumplimos con el RGPD.' },
    { question: '¿Puedo seguir el progreso de mi caso?', answer: 'Sí, desde tu panel de cliente con notificaciones en tiempo real.' },
    { question: '¿Qué pasa si el comerciante está en otro país de la UE?', answer: 'Contacta con Europa Consumidores (europe-consommateurs.eu), servicio gratuito oficial.' },
  ],
  de: [
    { question: 'Wie funktioniert der Erstattungsprozess bei LitigeFlow?', answer: 'Sie reichen Ihren Fall in 3 Schritten ein: Beschreibung, Beweise, Zusammenfassung. Unsere Agenten prüfen ihn innerhalb von 24 Stunden.' },
    { question: 'Welche Streitigkeiten bearbeiten Sie?', answer: 'Händlerstreitigkeiten, Flugverspätungen/-annullierungen (bis 600 € gemäß EG 261/2004), Online-Betrug, Bankrückbuchungen und grenzüberschreitende EU-Streitigkeiten.' },
    { question: 'Was kostet LitigeFlow?', answer: 'Einreichung und Beratung kostenlos. Pro-Plan: 20% Provision auf zurückgeholte Beträge. Premium-Plan: 49€/Monat. Keine Vorauszahlungen.' },
    { question: 'Was ist eine Rückbuchung?', answer: 'Eine Rückbuchung ist ein Lastschriftstreit mit Ihrer Bank. Sie haben in der Regel 120 Tage Zeit.' },
    { question: 'Wie viel bekomme ich für einen verspäteten Flug?', answer: 'EG-Verordnung 261/2004: 250 €, 400 € oder 600 € je nach Flugdistanz. Verspätung muss über 3 Stunden betragen.' },
    { question: 'Sind meine Daten sicher?', answer: 'Ja. Ihre Dokumente sind verschlüsselt und nur für Sie und zugewiesene Agenten zugänglich. DSGVO-konform.' },
    { question: 'Kann ich meinen Fall verfolgen?', answer: 'Ja, über Ihr Kunden-Dashboard mit Echtzeit-Benachrichtigungen.' },
    { question: 'Was wenn der Händler in einem anderen EU-Land ist?', answer: 'Kontaktieren Sie Europe Consumers (europe-consommateurs.eu), einen kostenlosen offiziellen Dienst.' },
  ],
};

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faq' });
  const faqs = FAQS[locale] ?? FAQS.en;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <FAQClient
        faqs={faqs}
        title={t('title')}
        subtitle={t('subtitle')}
        stillQuestion={t('stillQuestion')}
        stillDesc={t('stillDesc')}
        ctaClaim={t('ctaClaim')}
        ctaResources={t('ctaResources')}
        locale={locale}
      />
    </>
  );
}
