'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, BookOpen, ShoppingCart, Plane, Scale, Star } from 'lucide-react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

interface Resource {
  name: string; url: string; description: string;
  tag: string; tagColor: string; official?: boolean; free?: boolean; stars?: number;
}
interface Category {
  id: string; label: string; icon: React.ReactNode; color: string; intro: string; resources: Resource[];
}

const CATEGORIES: Category[] = [
  {
    id: 'cashback', label: 'Cashback', icon: <ShoppingCart className="w-5 h-5" />, color: 'bg-orange-100 text-orange-700',
    intro: 'Ces plateformes vous reversent un pourcentage de vos achats en ligne ou en magasin.',
    resources: [
      { name: 'iGraal', url: 'https://fr.igraal.com', description: 'Leader du marché en France. Extension navigateur, large réseau de marchands.', tag: 'Cashback', tagColor: 'bg-orange-100 text-orange-700', free: true, stars: 5 },
      { name: 'EBuyClub', url: 'https://www.ebuyclub.com', description: 'Remboursement en ligne et via bons d\'achat physiques.', tag: 'Cashback', tagColor: 'bg-orange-100 text-orange-700', free: true, stars: 4 },
      { name: 'Poulpeo', url: 'https://www.poulpeo.com', description: 'Plateforme française avec large communauté d\'entraide.', tag: 'Cashback', tagColor: 'bg-orange-100 text-orange-700', free: true, stars: 4 },
      { name: 'Widilo', url: 'https://www.widilo.fr', description: 'Taux de remboursement parmi les plus élevés du marché.', tag: 'Cashback', tagColor: 'bg-orange-100 text-orange-700', free: true, stars: 4 },
      { name: 'Joko', url: 'https://www.joko.com', description: 'Remboursement automatique via carte bancaire liée.', tag: 'Appli', tagColor: 'bg-yellow-100 text-yellow-700', free: true, stars: 5 },
      { name: 'Wanteeed', url: 'https://www.wanteeed.com', description: 'Extension navigateur associant codes promos et cashback.', tag: 'Extension', tagColor: 'bg-blue-100 text-blue-700', free: true, stars: 4 },
      { name: 'Capital Koala', url: 'https://www.capitalkoala.com', description: 'Reverse les gains sur le livret d\'épargne de vos enfants.', tag: 'Épargne', tagColor: 'bg-green-100 text-green-700', free: true, stars: 4 },
      { name: 'Shopmium', url: 'https://www.shopmium.com', description: 'Remboursement de courses au supermarché via l\'appli.', tag: 'Courses', tagColor: 'bg-teal-100 text-teal-700', free: true, stars: 4 },
      { name: 'Naomi', url: 'https://www.naomi.fr', description: 'Cashback automatique dédié aux enseignes partenaires.', tag: 'Cashback', tagColor: 'bg-orange-100 text-orange-700', free: true, stars: 3 },
      { name: 'Maximiles', url: 'https://www.maximiles.fr', description: 'Points convertibles en cadeaux ou remboursements.', tag: 'Points', tagColor: 'bg-purple-100 text-purple-700', free: true, stars: 3 },
    ],
  },
  {
    id: 'transport', label: 'Transport', icon: <Plane className="w-5 h-5" />, color: 'bg-sky-100 text-sky-700',
    intro: 'Ces services vous aident à obtenir l\'indemnisation légale (jusqu\'à 600 €) en cas de retard ou annulation de vol.',
    resources: [
      { name: 'AirHelp', url: 'https://www.airhelp.com/fr', description: 'Spécialiste mondial. Gère votre dossier contre commission.', tag: 'Commission', tagColor: 'bg-sky-100 text-sky-700', stars: 5 },
      { name: 'Flightright', url: 'https://www.flightright.fr', description: 'Cabinet juridique automatisé pour dossiers aériens.', tag: 'Commission', tagColor: 'bg-sky-100 text-sky-700', stars: 4 },
      { name: 'RefundMyTicket', url: 'https://www.refundmyticket.com', description: 'Réseau d\'experts juridiques pour transports européens.', tag: 'Commission', tagColor: 'bg-sky-100 text-sky-700', stars: 4 },
      { name: 'RetardVol', url: 'https://www.retardvol.fr', description: 'Site français dédié aux passagers victimes de retards.', tag: 'Commission', tagColor: 'bg-sky-100 text-sky-700', stars: 4 },
    ],
  },
  {
    id: 'officiel', label: 'Portails officiels', icon: <Scale className="w-5 h-5" />, color: 'bg-green-100 text-green-700',
    intro: 'Plateformes institutionnelles gratuites pour signaler, porter plainte ou obtenir une médiation.',
    resources: [
      { name: 'SignalConso', url: 'https://signal.conso.gouv.fr', description: 'Plateforme officielle DGCCRF pour signaler un professionnel.', tag: 'Officiel', tagColor: 'bg-green-100 text-green-700', official: true, free: true, stars: 5 },
      { name: 'Thésée / MaSécurité', url: 'https://www.masecurite.interieur.gouv.fr', description: 'Outil officiel du Ministère de l\'Intérieur pour porter plainte.', tag: 'Officiel', tagColor: 'bg-green-100 text-green-700', official: true, free: true, stars: 5 },
      { name: 'Europe Consommateurs', url: 'https://www.europe-consommateurs.eu', description: 'Service gratuit pour litiges avec un marchand européen.', tag: 'Officiel UE', tagColor: 'bg-blue-100 text-blue-700', official: true, free: true, stars: 5 },
      { name: 'Litige.fr', url: 'https://www.litige.fr', description: 'Mises en demeure juridiques officielles en ligne.', tag: 'Juridique', tagColor: 'bg-indigo-100 text-indigo-700', stars: 4 },
      { name: 'Ameli.fr', url: 'https://www.ameli.fr', description: 'Portail Assurance Maladie pour remboursements de santé.', tag: 'Santé', tagColor: 'bg-teal-100 text-teal-700', official: true, free: true, stars: 5 },
      { name: 'Impots.gouv.fr', url: 'https://www.impots.gouv.fr', description: 'Demande de remboursement de trop-perçu fiscal.', tag: 'Fiscal', tagColor: 'bg-yellow-100 text-yellow-700', official: true, free: true, stars: 5 },
    ],
  },
];

export default function ResourcesClient() {
  const t = useTranslations('resources');
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = CATEGORIES
    .filter((cat) => activeCategory === 'all' || cat.id === activeCategory)
    .map((cat) => ({
      ...cat,
      resources: cat.resources.filter(
        (r) => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.resources.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <BookOpen className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('subtitle')}</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <input
            type="search" placeholder={t('search')} value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
          />
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setActiveCategory('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:border-indigo-400'}`}>
              {t('all')}
            </button>
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${activeCategory === cat.id ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:border-indigo-400'}`}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.map((cat, ci) => (
          <motion.section key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.1 }} className="mb-16">
            <div className="flex items-center gap-3 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-sm ${cat.color}`}>
                {cat.icon} {cat.label}
              </span>
            </div>
            <p className="text-gray-600 mb-6 text-sm">{cat.intro}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cat.resources.map((r, ri) => (
                <motion.a key={ri} href={r.url} target="_blank" rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: ci * 0.1 + ri * 0.04 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-5 group border border-gray-100 hover:border-indigo-200 block"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{r.name}</h3>
                      {r.official && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">✓ {t('official')}</span>}
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 flex-shrink-0 transition-colors" />
                  </div>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">{r.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${r.tagColor}`}>{r.tag}</span>
                    <div className="flex items-center gap-2">
                      {r.free && <span className="text-xs text-green-600 font-medium">{t('free')}</span>}
                      {r.stars && (
                        <div className="flex gap-0.5">
                          {Array.from({ length: r.stars }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.section>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">{t('noResults')} « {search} »</p>
            <button onClick={() => setSearch('')} className="mt-4 text-indigo-600 hover:underline">{t('clearSearch')}</button>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{t('ctaTitle')}</h2>
          <p className="text-indigo-100 mb-6">{t('ctaDesc')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/claim/new`} className="bg-white hover:bg-gray-100 text-indigo-600 px-6 py-3 rounded-lg font-semibold transition-colors">{t('ctaClaim')}</Link>
            <Link href={`/${locale}/faq`} className="bg-indigo-800 hover:bg-indigo-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors">{t('ctaFaq')}</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
