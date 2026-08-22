import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import LegalLayout from '@/components/LegalLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal.privacy' });
  return { title: t('title') };
}

const CONTENT: Record<string, { title: string; sections: { heading: string; body: string }[] }> = {
  fr: {
    title: 'Politique de confidentialité',
    sections: [
      { heading: '1. Responsable du traitement', body: 'LitigeFlow SAS, dont le siège social est situé en France, est responsable du traitement de vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD – UE 2016/679).' },
      { heading: '2. Données collectées', body: 'Nous collectons : nom, adresse e-mail, informations de transaction, pièces justificatives téléchargées, adresse IP, données de navigation. Ces données sont nécessaires à la fourniture de nos services de gestion de litiges.' },
      { heading: '3. Finalités du traitement', body: 'Vos données sont utilisées pour : gérer votre dossier de litige, vous contacter concernant votre dossier, améliorer nos services, respecter nos obligations légales, traiter vos paiements via Stripe.' },
      { heading: '4. Base légale', body: 'Le traitement est fondé sur : l\'exécution du contrat (art. 6.1.b RGPD), votre consentement (art. 6.1.a), nos obligations légales (art. 6.1.c) et notre intérêt légitime (art. 6.1.f).' },
      { heading: '5. Durée de conservation', body: 'Vos données sont conservées pendant la durée de votre relation contractuelle avec LitigeFlow, puis archivées 5 ans conformément aux obligations légales françaises.' },
      { heading: '6. Vos droits', body: 'Conformément au RGPD, vous disposez des droits d\'accès, de rectification, d\'effacement, de portabilité, d\'opposition et de limitation. Pour exercer ces droits : privacy@litigeflow.com. Vous pouvez également saisir la CNIL (cnil.fr).' },
      { heading: '7. Transferts internationaux', body: 'Certaines données peuvent être transférées hors UE (ex. Stripe aux USA). Ces transferts sont encadrés par des clauses contractuelles types approuvées par la Commission européenne.' },
      { heading: '8. Cookies', body: 'Voir notre politique de cookies pour les détails sur les traceurs utilisés.' },
    ],
  },
  en: {
    title: 'Privacy Policy',
    sections: [
      { heading: '1. Data Controller', body: 'LitigeFlow is the data controller for your personal data, in compliance with GDPR (EU 2016/679), CCPA (California), and PIPEDA (Canada).' },
      { heading: '2. Data Collected', body: 'We collect: name, email address, transaction information, uploaded supporting documents, IP address, browsing data. This data is necessary to provide our dispute management services.' },
      { heading: '3. Purposes', body: 'Your data is used to: manage your dispute case, contact you about your case, improve our services, comply with legal obligations, process payments via Stripe.' },
      { heading: '4. Legal Basis', body: 'Processing is based on: contract performance (Art. 6.1.b GDPR), your consent (Art. 6.1.a), legal obligations (Art. 6.1.c), and legitimate interest (Art. 6.1.f).' },
      { heading: '5. Retention', body: 'Your data is retained for the duration of your contractual relationship with LitigeFlow, then archived for 5 years in compliance with legal obligations.' },
      { heading: '6. Your Rights', body: 'Under GDPR/CCPA/PIPEDA, you have rights of access, rectification, erasure, portability, objection, and restriction. Contact: privacy@litigeflow.com.' },
      { heading: '7. International Transfers', body: 'Some data may be transferred outside the EU/EEA (e.g. Stripe in the USA). These transfers are governed by Standard Contractual Clauses approved by the European Commission.' },
      { heading: '8. Cookies', body: 'See our Cookie Policy for details on trackers used.' },
    ],
  },
  es: {
    title: 'Política de privacidad',
    sections: [
      { heading: '1. Responsable del tratamiento', body: 'LitigeFlow es el responsable del tratamiento de sus datos personales, de conformidad con el RGPD (UE 2016/679).' },
      { heading: '2. Datos recopilados', body: 'Recopilamos: nombre, correo electrónico, información de transacciones, documentos justificativos, dirección IP, datos de navegación.' },
      { heading: '3. Finalidades', body: 'Sus datos se utilizan para: gestionar su reclamación, contactarle, mejorar nuestros servicios, cumplir obligaciones legales, procesar pagos mediante Stripe.' },
      { heading: '4. Base legal', body: 'El tratamiento se basa en: ejecución del contrato, su consentimiento, obligaciones legales e interés legítimo.' },
      { heading: '5. Conservación', body: 'Sus datos se conservan durante la relación contractual y se archivan 5 años conforme a las obligaciones legales.' },
      { heading: '6. Sus derechos', body: 'Tiene derechos de acceso, rectificación, supresión, portabilidad, oposición y limitación. Contacto: privacy@litigeflow.com.' },
      { heading: '7. Transferencias internacionales', body: 'Algunos datos pueden transferirse fuera de la UE (ej. Stripe en EE.UU.), amparados por cláusulas contractuales tipo.' },
      { heading: '8. Cookies', body: 'Consulte nuestra política de cookies para más detalles.' },
    ],
  },
  de: {
    title: 'Datenschutzrichtlinie',
    sections: [
      { heading: '1. Verantwortlicher', body: 'LitigeFlow ist der Verantwortliche für die Verarbeitung Ihrer personenbezogenen Daten gemäß DSGVO (EU 2016/679).' },
      { heading: '2. Erhobene Daten', body: 'Wir erheben: Name, E-Mail-Adresse, Transaktionsinformationen, hochgeladene Belege, IP-Adresse, Browsing-Daten.' },
      { heading: '3. Zwecke', body: 'Ihre Daten werden verwendet für: Fallverwaltung, Kontaktaufnahme, Serviceverbesserung, Einhaltung gesetzlicher Pflichten, Zahlungsabwicklung über Stripe.' },
      { heading: '4. Rechtsgrundlage', body: 'Die Verarbeitung basiert auf: Vertragserfüllung, Einwilligung, gesetzlichen Pflichten und berechtigtem Interesse.' },
      { heading: '5. Speicherdauer', body: 'Ihre Daten werden für die Dauer der Vertragsbeziehung gespeichert und danach 5 Jahre archiviert.' },
      { heading: '6. Ihre Rechte', body: 'Sie haben Rechte auf Auskunft, Berichtigung, Löschung, Übertragbarkeit, Widerspruch und Einschränkung. Kontakt: privacy@litigeflow.com.' },
      { heading: '7. Internationale Übermittlungen', body: 'Einige Daten können außerhalb der EU übermittelt werden (z.B. Stripe in den USA), abgesichert durch Standardvertragsklauseln.' },
      { heading: '8. Cookies', body: 'Siehe unsere Cookie-Richtlinie für Details.' },
    ],
  },
};

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = CONTENT[locale] ?? CONTENT.en;
  return <LegalLayout title={content.title} sections={content.sections} />;
}
