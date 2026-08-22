import type { Metadata } from 'next';
import FAQClient from './FAQClient';

export const metadata: Metadata = {
  title: 'FAQ – Questions fréquentes sur les remboursements et litiges',
  description:
    'Toutes les réponses sur les démarches de remboursement : litige marchand, retard de vol, chargeback, arnaque en ligne, cashback. Délais, coûts, procédures expliqués simplement.',
  alternates: { canonical: '/faq' },
};

const FAQS = [
  {
    question: 'Comment fonctionne la procédure de remboursement sur LitigeFlow ?',
    answer: 'Vous déposez votre dossier en 3 étapes : description du litige, upload des preuves (factures, captures d\'écran, échanges), récapitulatif. Nos agents examinent votre dossier sous 24 h et vous orientent vers le recours le plus adapté (mise en demeure, chargeback, signalement officiel, indemnisation aérienne…).',
  },
  {
    question: 'Quels types de litiges pouvez-vous traiter ?',
    answer: 'Nous traitons les litiges marchands (produit non livré, non conforme), les retards et annulations de vols (jusqu\'à 600 € via le règlement CE 261/2004), les arnaques en ligne, les demandes de chargeback bancaire, les litiges transfrontaliers européens et les demandes de remboursement de frais de santé ou fiscaux.',
  },
  {
    question: 'Combien coûte le service LitigeFlow ?',
    answer: 'Le dépôt de dossier et l\'orientation sont entièrement gratuits. Pour les dossiers nécessitant un accompagnement actif (rédaction de mise en demeure, liaison avec les institutions), une commission sur le montant récupéré peut s\'appliquer. Aucune avance de frais n\'est demandée.',
  },
  {
    question: 'Qu\'est-ce qu\'un chargeback et comment l\'obtenir ?',
    answer: 'Le chargeback est une procédure de contestation de débit auprès de votre banque ou de l\'émetteur de votre carte (Visa, Mastercard). Vous disposez généralement de 120 jours après la transaction pour le demander. Il est particulièrement efficace en cas de fraude ou de marchand qui ne livre pas. Contactez directement votre banque ou utilisez notre formulaire pour préparer votre dossier.',
  },
  {
    question: 'Combien puis-je obtenir pour un vol retardé ou annulé ?',
    answer: 'Le règlement européen CE 261/2004 prévoit une indemnisation forfaitaire de 250 € (vols < 1 500 km), 400 € (vols intra-UE > 1 500 km ou autres entre 1 500 et 3 500 km) ou 600 € (vols > 3 500 km). Le retard doit être de plus de 3 heures à l\'arrivée et la cause doit être imputable à la compagnie (pas les circonstances extraordinaires).',
  },
  {
    question: 'Quelle est la différence entre SignalConso et Litige.fr ?',
    answer: 'SignalConso (signal.conso.gouv.fr) est la plateforme officielle de la DGCCRF pour signaler un problème à un professionnel. C\'est gratuit et officiel, mais sans force contraignante immédiate. Litige.fr est une plateforme privée qui génère des mises en demeure juridiques officielles, plus contraignantes pour le marchand. Les deux sont complémentaires.',
  },
  {
    question: 'Que faire si j\'ai été victime d\'une arnaque en ligne ?',
    answer: '1) Signalez immédiatement sur Thésée (masecurite.interieur.gouv.fr) pour porter plainte en ligne. 2) Contactez votre banque pour demander un chargeback si vous avez payé par carte. 3) Signalez sur SignalConso. 4) Si le vendeur est identifié, envoyez une mise en demeure via Litige.fr. Agissez vite : les délais de chargeback sont limités.',
  },
  {
    question: 'Mes données personnelles sont-elles sécurisées ?',
    answer: 'Oui. Vos pièces justificatives sont stockées de manière chiffrée et accessibles uniquement par vous et les agents assignés à votre dossier. Nous respectons le RGPD. Aucune donnée n\'est revendue à des tiers.',
  },
  {
    question: 'Puis-je suivre l\'avancement de mon dossier ?',
    answer: 'Oui, depuis votre tableau de bord client. Chaque changement de statut (PENDING → INVESTIGATING → RESOLVED) vous est notifié. Vous pouvez également utiliser l\'outil de suivi rapide sur la page d\'accueil avec votre numéro de dossier.',
  },
  {
    question: 'Que faire si le marchand est dans un autre pays de l\'UE ?',
    answer: 'Contactez Europe Consommateurs (europe-consommateurs.eu), le réseau officiel européen d\'aide aux consommateurs. Ce service est gratuit et dispose d\'experts dans chaque pays membre. Vous pouvez également déposer votre dossier sur LitigeFlow qui coordonne avec les partenaires européens.',
  },
];

export default function FAQPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FAQClient faqs={FAQS} />
    </>
  );
}
