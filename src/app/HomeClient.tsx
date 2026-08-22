'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, CheckCircle, Clock, FileText, Search, Globe, Lock, Zap, ShoppingCart, Plane, Scale, Heart, Euro } from 'lucide-react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import FeeCalculator from '@/components/FeeCalculator';
import TrackClaim from '@/components/TrackClaim';
import RefundOrienteur from '@/components/RefundOrienteur';

const useCountUp = (target: number, duration = 2000) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
};

export default function HomeClient() {
  const t = useTranslations();
  const locale = useLocale();
  const recovered = useCountUp(2400000);
  const clients = useCountUp(6000);
  const rate = useCountUp(94);

  const FEATURES = [
    { icon: <Search className="w-8 h-8 text-indigo-600" />, title: t('features.analysis.title'), description: t('features.analysis.desc') },
    { icon: <Globe className="w-8 h-8 text-indigo-600" />, title: t('features.portals.title'), description: t('features.portals.desc') },
    { icon: <Lock className="w-8 h-8 text-indigo-600" />, title: t('features.security.title'), description: t('features.security.desc') },
    { icon: <Zap className="w-8 h-8 text-indigo-600" />, title: t('features.tracking.title'), description: t('features.tracking.desc') },
  ];

  const PROCESS = [
    { step: '01', title: t('process.step1.title'), description: t('process.step1.desc'), icon: <FileText className="w-6 h-6" /> },
    { step: '02', title: t('process.step2.title'), description: t('process.step2.desc'), icon: <CheckCircle className="w-6 h-6" /> },
    { step: '03', title: t('process.step3.title'), description: t('process.step3.desc'), icon: <Clock className="w-6 h-6" /> },
  ];

  const CATEGORIES = [
    { icon: <ShoppingCart className="w-6 h-6" />, label: t('categories.merchant.label'), color: 'bg-blue-100 text-blue-700', desc: t('categories.merchant.desc') },
    { icon: <Plane className="w-6 h-6" />, label: t('categories.flight.label'), color: 'bg-sky-100 text-sky-700', desc: t('categories.flight.desc') },
    { icon: <Scale className="w-6 h-6" />, label: t('categories.scam.label'), color: 'bg-red-100 text-red-700', desc: t('categories.scam.desc') },
    { icon: <Heart className="w-6 h-6" />, label: t('categories.health.label'), color: 'bg-green-100 text-green-700', desc: t('categories.health.desc') },
    { icon: <Euro className="w-6 h-6" />, label: t('categories.tax.label'), color: 'bg-yellow-100 text-yellow-700', desc: t('categories.tax.desc') },
    { icon: <Globe className="w-6 h-6" />, label: t('categories.crossborder.label'), color: 'bg-purple-100 text-purple-700', desc: t('categories.crossborder.desc') },
  ];

  const TESTIMONIALS = [
    { name: 'Marie L.', role: locale === 'fr' ? 'Particulière' : 'Individual', content: locale === 'fr' ? 'J\'ai récupéré 480 € suite à l\'annulation de mon vol Paris-Madrid. LitigeFlow a géré tout le dossier en moins de 3 semaines.' : 'I recovered €480 after my Paris-Madrid flight was cancelled. LitigeFlow handled everything in under 3 weeks.', avatar: '👩' },
    { name: 'Thomas B.', role: locale === 'fr' ? 'Auto-entrepreneur' : 'Freelancer', content: locale === 'fr' ? 'Litige avec un fournisseur en ligne : produit jamais livré. Grâce à la mise en demeure, j\'ai été remboursé en 10 jours.' : 'Dispute with an online supplier: product never delivered. Thanks to the formal notice, I was refunded in 10 days.', avatar: '👨' },
    { name: 'Sophie M.', role: locale === 'fr' ? 'Retraitée' : 'Retired', content: locale === 'fr' ? 'Victime d\'une arnaque téléphonique. Le dépôt de plainte a permis d\'ouvrir une enquête. Je recommande.' : 'Victim of a phone scam. Filing the complaint opened an investigation. Highly recommend.', avatar: '👵' },
  ];

  const numFmt = new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1 rounded-full mb-4">
                {t('hero.badge')}
              </span>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {t('hero.title')}{' '}
                <span className="text-indigo-600">{t('hero.titleHighlight')}</span>{' '}
                {t('hero.titleEnd')}
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">{t('hero.description')}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={`/${locale}/claim/new`} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center">
                  {t('hero.cta')} <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link href={`/${locale}/resources`} className="bg-white hover:bg-gray-100 text-indigo-600 border-2 border-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center">
                  {t('hero.ctaSecondary')}
                </Link>
              </div>
              <p className="mt-4 text-sm text-gray-500 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" /> {t('hero.trust')}
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}>
              <RefundOrienteur />
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-5xl font-bold text-indigo-600 mb-2">{numFmt.format(recovered)} €</div>
              <p className="text-gray-600 text-lg">{t('stats.recovered')}</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-indigo-600 mb-2">{numFmt.format(clients)}+</div>
              <p className="text-gray-600 text-lg">{t('stats.claims')}</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-indigo-600 mb-2">{rate} %</div>
              <p className="text-gray-600 text-lg">{t('stats.satisfaction')}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Catégories */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('categories.title')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('categories.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className={`inline-flex p-3 rounded-lg mb-4 ${cat.color}`}>{cat.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{cat.label}</h3>
                <p className="text-gray-600 text-sm">{cat.desc}</p>
                <Link href={`/${locale}/claim/new`} className="mt-3 inline-flex items-center text-indigo-600 text-sm font-medium hover:underline">
                  {t('categories.cta')} <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('features.title')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('features.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('process.title')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('process.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROCESS.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="relative">
                <div className="bg-gray-50 rounded-xl p-8 shadow-sm h-full">
                  <div className="text-6xl font-bold text-indigo-200 mb-4">{step.step}</div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">{step.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {i < 2 && <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-indigo-300"><ArrowRight className="w-8 h-8" /></div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('tools.title')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('tools.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FeeCalculator />
            <TrackClaim />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('testimonials.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t2, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-2xl">{t2.avatar}</div>
                  <div><h4 className="font-bold text-gray-900">{t2.name}</h4><p className="text-sm text-gray-600">{t2.role}</p></div>
                </div>
                <p className="text-gray-700 italic">"{t2.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">{t('cta.title')}</h2>
          <p className="text-xl text-indigo-100 mb-8">{t('cta.subtitle')}</p>
          <Link href={`/${locale}/claim/new`} className="bg-white hover:bg-gray-100 text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center">
            {t('cta.button')} <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
