import type { Metadata } from 'next';
import ResourcesClient from './ResourcesClient';

export const metadata: Metadata = {
  title: 'Ressources & Annuaire – 20 Sites pour Obtenir un Remboursement',
  description:
    'Annuaire complet des meilleures plateformes de remboursement légales : cashback (iGraal, Widilo, Joko…), indemnisation vol (AirHelp, Flightright…), portails officiels (SignalConso, Litige.fr, Ameli, Impots.gouv…).',
  alternates: { canonical: '/resources' },
};

export default function ResourcesPage() {
  return <ResourcesClient />;
}
