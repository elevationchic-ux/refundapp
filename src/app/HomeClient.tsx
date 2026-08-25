'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, ArrowRight, CheckCircle, Clock, FileText,
  Search, Globe, Lock, Zap, ShoppingCart, Plane, Scale, Heart, Euro,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import FeeCalculator from '@/components/FeeCalculator';
import TrackClaim from '@/components/TrackClaim';
import RefundOrienteur from '@/components/RefundOrienteur';

import { getRegionFromLocale } from '@/lib/currency';
import { getTestimonialsForRegion } from '@/data/testimonials';

const useCountUp = (target: number, duration = 2000) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const inc = target / (duration / 16);
    const timer = setInterval(() => {
      start += inc;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
};

// Icons defined outside component to avoid React serialization error #441
const FEATURE_ICONS = [
  <Search key="search" className="w-8 h-8 text-indigo-600" />,
  <Globe key="globe" className="w-8 h-8 text-indigo-600" />,
  <Lock key="lock" className="w-8 h-8 text-indigo-600" />,
  <Zap key="zap" className="w-8 h-8 text-indigo-600" />,
];

const PROCESS_ICONS = [
  <FileText key="file" className="w-6 h-6" />,
  <CheckCircle key="check" className="w-6 h-6" />,
  <Clock key="clock" className="w-6 h-6" />,
];

const CATEGORY_ICONS = [
  <ShoppingCart key="cart" className="w-6 h-6" />,
  <Plane key="plane" className="w-6 h-6" />,
  <Scale key="scale" className="w-6 h-6" />,
  <Heart key="heart" className="w-6 h-6" />,
  <Euro key="euro" className="w-6 h-6" />,
  <Globe key="globe2" className="w-6 h-6" />,
];

const CATEGORY_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-sky-100 text-sky-700',
  'bg-red-100 text-red-700',
  'bg-green-100 text-green-700',
  'bg-yellow-100 text-yellow-700',
  'bg-purple-100 text-purple-700',
];

const TESTIMONIALS = [
  { id: 1, name: 'User 1', avatarBg: 'bg-pink-100', initials: 'U1' },
  { id: 2, name: 'User 2', avatarBg: 'bg-blue-100', initials: 'U2' },
  { id: 3, name: 'User 3', avatarBg: 'bg-green-100', initials: 'U3' },
  { id: 4, name: 'User 4', avatarBg: 'bg-purple-100', initials: 'U4' },
];

export default function HomeClient() {
  const t = useTranslations();
  const locale = useLocale();
  const recovered = useCountUp(2400000);
  const clients = useCountUp(6000);
  const rate = useCountUp(94);

  // Dynamic currency based on locale
  const getCurrency = () => {
    if (locale.startsWith('en-US')) return { symbol: '$', amount: 2600000 }; // USD
    if (locale.startsWith('en-CA') || locale.startsWith('fr-CA')) return { symbol: 'CA$', amount: 3200000 }; // CAD
    if (locale.startsWith('en-GB')) return { symbol: '£', amount: 2000000 }; // GBP
    return { symbol: '€', amount: 2400000 }; // EUR (default)
  };
  
  const currency = getCurrency();
  const recoveredAmount = useCountUp(currency.amount);

  const featureKeys = ['analysis', 'portals', 'security', 'tracking'] as const;
  const processKeys = ['step1', 'step2', 'step3'] as const;
  const categoryKeys = ['merchant', 'flight', 'scam', 'health', 'tax', 'crossborder'] as const;

  // Get localized testimonials
  const region = getRegionFromLocale(locale);
  const regionalTestimonials = getTestimonialsForRegion(region);
  const testimonialContents = regionalTestimonials.map(t => t.quote);

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
            {[
              { value: `${currency.symbol}${numFmt.format(recoveredAmount)}`, label: t('stats.recovered') },
              { value: `${numFmt.format(clients)}+`, label: t('stats.claims') },
              { value: `${rate} %`, label: t('stats.satisfaction') },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                <p className="text-gray-600 text-lg">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('categories.title')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('categories.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryKeys.map((key, i) => (
              <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className={`inline-flex p-3 rounded-lg mb-4 ${CATEGORY_COLORS[i]}`}>{CATEGORY_ICONS[i]}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{t(`categories.${key}.label`)}</h3>
                <p className="text-gray-600 text-sm">{t(`categories.${key}.desc`)}</p>
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
            {featureKeys.map((key, i) => (
              <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4">{FEATURE_ICONS[i]}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t(`features.${key}.title`)}</h3>
                <p className="text-gray-600">{t(`features.${key}.desc`)}</p>
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
            {processKeys.map((key, i) => (
              <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="relative">
                <div className="bg-gray-50 rounded-xl p-8 shadow-sm h-full">
                  <div className="text-6xl font-bold text-indigo-200 mb-4">0{i + 1}</div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">{PROCESS_ICONS[i]}</div>
                    <h3 className="text-xl font-bold text-gray-900">{t(`process.${key}.title`)}</h3>
                  </div>
                  <p className="text-gray-600">{t(`process.${key}.desc`)}</p>
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
            {regionalTestimonials.slice(0, 3).map((testimonial, i) => {
              const initials = testimonial.name.split(' ').map(n => n[0]).join('');
              const avatarColors = ['bg-pink-100', 'bg-blue-100', 'bg-green-100'];
              
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 ${avatarColors[i % 3]} rounded-full flex items-center justify-center font-bold text-gray-700`}>
                      {initials}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                      <div className="flex gap-0.5 mt-0.5">
                        {[...Array(testimonial.rating)].map((_, s) => <span key={s} className="text-yellow-400 text-xs">★</span>)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{testimonial.amount}</p>
                      <p className="text-xs text-gray-500 capitalize">{testimonial.case}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                </motion.div>
              );
            })}
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
