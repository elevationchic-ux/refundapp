'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ExternalLink, RotateCcw, CheckCircle } from 'lucide-react';

type Step = 'category' | 'detail' | 'result';

interface Resource {
  name: string;
  url: string;
  description: string;
  tag: string;
  tagColor: string;
  official?: boolean;
}

interface Category {
  id: string;
  label: string;
  emoji: string;
  details: { id: string; label: string; resources: Resource[] }[];
}

const CATEGORIES: Category[] = [
  {
    id: 'marchand',
    label: 'Litige avec un marchand',
    emoji: '🛍️',
    details: [
      {
        id: 'non-livre',
        label: 'Produit non livré / non conforme',
        resources: [
          { name: 'Litige.fr', url: 'https://www.litige.fr', description: 'Mise en demeure officielle en ligne', tag: 'Mise en demeure', tagColor: 'bg-blue-100 text-blue-700' },
          { name: 'SignalConso', url: 'https://signal.conso.gouv.fr', description: 'Signalement officiel DGCCRF', tag: 'Officiel', tagColor: 'bg-green-100 text-green-700', official: true },
          { name: 'Europe Consommateurs', url: 'https://www.europe-consommateurs.eu', description: 'Litige avec un marchand européen', tag: 'UE', tagColor: 'bg-purple-100 text-purple-700', official: true },
        ],
      },
      {
        id: 'chargeback',
        label: 'Paiement par carte  demander un chargeback',
        resources: [
          { name: 'Votre banque (chargeback)', url: 'https://www.service-public.fr/particuliers/vosdroits/F24270', description: 'Contestation de débit auprès de votre banque', tag: 'Chargeback', tagColor: 'bg-orange-100 text-orange-700', official: true },
          { name: 'Litige.fr', url: 'https://www.litige.fr', description: 'Accompagnement pour la procédure', tag: 'Aide', tagColor: 'bg-blue-100 text-blue-700' },
        ],
      },
    ],
  },
  {
    id: 'transport',
    label: 'Retard / annulation de transport',
    emoji: '✈️',
    details: [
      {
        id: 'vol',
        label: 'Vol retardé ou annulé (jusqu\'à 600 €)',
        resources: [
          { name: 'AirHelp', url: 'https://www.airhelp.com/fr', description: 'Spécialiste mondial indemnisation aérienne', tag: 'Commission', tagColor: 'bg-sky-100 text-sky-700' },
          { name: 'Flightright', url: 'https://www.flightright.fr', description: 'Cabinet juridique automatisé', tag: 'Commission', tagColor: 'bg-sky-100 text-sky-700' },
          { name: 'RefundMyTicket', url: 'https://www.refundmyticket.com', description: 'Réseau d\'experts juridiques européens', tag: 'Commission', tagColor: 'bg-sky-100 text-sky-700' },
          { name: 'RetardVol', url: 'https://www.retardvol.fr', description: 'Site français dédié aux passagers', tag: 'Gratuit', tagColor: 'bg-green-100 text-green-700' },
        ],
      },
      {
        id: 'train',
        label: 'Train / bus retardé',
        resources: [
          { name: 'SNCF Connect (remboursement)', url: 'https://www.sncf-connect.com', description: 'Demande de remboursement directe SNCF', tag: 'Officiel', tagColor: 'bg-green-100 text-green-700', official: true },
          { name: 'Europe Consommateurs', url: 'https://www.europe-consommateurs.eu', description: 'Litige transfrontalier train/bus', tag: 'UE', tagColor: 'bg-purple-100 text-purple-700', official: true },
        ],
      },
    ],
  },
  {
    id: 'arnaque',
    label: 'Arnaque / escroquerie en ligne',
    emoji: '🚨',
    details: [
      {
        id: 'plainte',
        label: 'Porter plainte et signaler',
        resources: [
          { name: 'Thésée / MaSécurité', url: 'https://www.masecurite.interieur.gouv.fr', description: 'Plainte en ligne  Ministère de l\'Intérieur', tag: 'Officiel', tagColor: 'bg-green-100 text-green-700', official: true },
          { name: 'SignalConso', url: 'https://signal.conso.gouv.fr', description: 'Signalement DGCCRF', tag: 'Officiel', tagColor: 'bg-green-100 text-green-700', official: true },
        ],
      },
      {
        id: 'recuperer',
        label: 'Tenter de récupérer les fonds',
        resources: [
          { name: 'Votre banque (chargeback)', url: 'https://www.service-public.fr/particuliers/vosdroits/F24270', description: 'Contestation de débit  à faire rapidement', tag: 'Urgent', tagColor: 'bg-red-100 text-red-700', official: true },
          { name: 'Litige.fr', url: 'https://www.litige.fr', description: 'Mise en demeure si vendeur identifié', tag: 'Juridique', tagColor: 'bg-blue-100 text-blue-700' },
        ],
      },
    ],
  },
  {
    id: 'cashback',
    label: 'Cashback & remboursement partiel',
    emoji: '💰',
    details: [
      {
        id: 'courses',
        label: 'Courses & supermarché',
        resources: [
          { name: 'Shopmium', url: 'https://www.shopmium.com', description: 'Remboursement courses via l\'appli', tag: 'Appli', tagColor: 'bg-yellow-100 text-yellow-700' },
          { name: 'iGraal', url: 'https://fr.igraal.com', description: 'Leader cashback France', tag: 'Cashback', tagColor: 'bg-orange-100 text-orange-700' },
        ],
      },
      {
        id: 'achats-en-ligne',
        label: 'Achats en ligne',
        resources: [
          { name: 'iGraal', url: 'https://fr.igraal.com', description: 'Leader du marché, extension navigateur', tag: 'Cashback', tagColor: 'bg-orange-100 text-orange-700' },
          { name: 'Widilo', url: 'https://www.widilo.fr', description: 'Taux parmi les plus élevés', tag: 'Cashback', tagColor: 'bg-orange-100 text-orange-700' },
          { name: 'EBuyClub', url: 'https://www.ebuyclub.com', description: 'Remboursement + bons d\'achat', tag: 'Cashback', tagColor: 'bg-orange-100 text-orange-700' },
          { name: 'Joko', url: 'https://www.joko.com', description: 'Remboursement automatique via carte bancaire', tag: 'Appli', tagColor: 'bg-yellow-100 text-yellow-700' },
        ],
      },
    ],
  },
  {
    id: 'sante',
    label: 'Remboursement santé',
    emoji: '🏥',
    details: [
      {
        id: 'secu',
        label: 'Sécurité sociale & mutuelle',
        resources: [
          { name: 'Ameli.fr', url: 'https://www.ameli.fr', description: 'Suivi et demande de remboursement Assurance Maladie', tag: 'Officiel', tagColor: 'bg-green-100 text-green-700', official: true },
        ],
      },
    ],
  },
  {
    id: 'fiscal',
    label: 'Remboursement fiscal',
    emoji: '📋',
    details: [
      {
        id: 'impots',
        label: 'Trop-perçu / crédit d\'impôt',
        resources: [
          { name: 'Impots.gouv.fr', url: 'https://www.impots.gouv.fr', description: 'Demande de remboursement de trop-perçu fiscal', tag: 'Officiel', tagColor: 'bg-green-100 text-green-700', official: true },
        ],
      },
    ],
  },
];

export default function RefundOrienteur() {
  const [step, setStep] = useState<Step>('category');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<{ id: string; label: string; resources: Resource[] } | null>(null);

  const reset = () => {
    setStep('category');
    setSelectedCategory(null);
    setSelectedDetail(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200 min-h-[420px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">🧭 Quel est votre recours ?</h3>
          <p className="text-xs text-gray-500">Orienteur gratuit  résultat immédiat</p>
        </div>
        {step !== 'category' && (
          <button onClick={reset} className="text-gray-400 hover:text-gray-600 transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="flex gap-1 mb-5">
        {(['category', 'detail', 'result'] as Step[]).map((s, i) => (
          <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${
            step === 'category' && i === 0 ? 'bg-indigo-600' :
            step === 'detail' && i <= 1 ? 'bg-indigo-600' :
            step === 'result' ? 'bg-indigo-600' : 'bg-gray-200'
          }`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'category' && (
          <motion.div key="category" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
            <p className="text-sm font-medium text-gray-700 mb-3">Quelle est votre situation ?</p>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat); setStep('detail'); }}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all flex items-center justify-between group"
                >
                  <span className="text-sm font-medium text-gray-800">{cat.emoji} {cat.label}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'detail' && selectedCategory && (
          <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
            <p className="text-sm font-medium text-gray-700 mb-3">Précisez votre situation :</p>
            <div className="space-y-2">
              {selectedCategory.details.map((d) => (
                <button
                  key={d.id}
                  onClick={() => { setSelectedDetail(d); setStep('result'); }}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all flex items-center justify-between group"
                >
                  <span className="text-sm font-medium text-gray-800">{d.label}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'result' && selectedDetail && (
          <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <p className="text-sm font-medium text-gray-700">Vos recours recommandés :</p>
            </div>
            <div className="space-y-2">
              {selectedDetail.resources.map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 rounded-lg border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-bold text-gray-900">{r.name}</span>
                        {r.official && <span className="text-xs text-green-600 font-medium">✓ Officiel</span>}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{r.description}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.tagColor}`}>{r.tag}</span>
                      <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-indigo-600" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <a href="/claim/new" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                Déposer mon dossier sur LitigeFlow
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
