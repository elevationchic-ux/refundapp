'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, Star, Shield, ArrowRight, CreditCard, Lock } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function PricingClient() {
  const t = useTranslations('pricing');
  const locale = useLocale();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  // Get price in local currency
  const getPremiumPrice = () => {
    if (locale.startsWith('en-US')) return '$49';
    if (locale.startsWith('en-CA') || locale.startsWith('fr-CA')) return 'CA$59';
    if (locale.startsWith('en-GB')) return '£39';
    return '49 €'; // EUR (default)
  };

  async function handleStripeCheckout(plan: 'premium') {
    setLoadingPlan(plan);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, locale }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert('Payment service unavailable. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  }

  const plans = [
    {
      key: 'free',
      name: t('free.name'),
      price: locale.startsWith('en-US') ? '$0' : locale.startsWith('en-CA') ? 'CA$0' : locale.startsWith('en-GB') ? '£0' : t('free.price'),
      period: t('free.period'),
      desc: t('free.desc'),
      features: [t('free.features.0'), t('free.features.1'), t('free.features.2'), t('free.features.3')],
      icon: <Shield className="w-6 h-6" />,
      color: 'border-gray-200',
      btnColor: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
      popular: false,
      action: 'free',
    },
    {
      key: 'pro',
      name: t('pro.name'),
      price: t('pro.price'),
      period: t('pro.period'),
      desc: t('pro.desc'),
      features: [t('pro.features.0'), t('pro.features.1'), t('pro.features.2'), t('pro.features.3'), t('pro.features.4'), t('pro.features.5')],
      icon: <Zap className="w-6 h-6" />,
      color: 'border-indigo-500 ring-2 ring-indigo-500',
      btnColor: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      popular: true,
      action: 'pro',
    },
    {
      key: 'premium',
      name: t('premium.name'),
      price: getPremiumPrice(),
      period: t('premium.period'),
      desc: t('premium.desc'),
      features: [t('premium.features.0'), t('premium.features.1'), t('premium.features.2'), t('premium.features.3'), t('premium.features.4'), t('premium.features.5')],
      icon: <Star className="w-6 h-6" />,
      color: 'border-purple-300',
      btnColor: 'bg-purple-600 hover:bg-purple-700 text-white',
      popular: false,
      action: 'premium',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('subtitle')}</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            <Lock className="w-4 h-4" /> {t('noUpfront')}
          </div>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`relative bg-white rounded-2xl border-2 p-8 flex flex-col ${plan.color}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">{t('popular')}</span>
                </div>
              )}

              <div className={`inline-flex p-3 rounded-xl mb-4 w-fit ${plan.popular ? 'bg-indigo-100 text-indigo-600' : plan.key === 'premium' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                {plan.icon}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h2>
              <p className="text-gray-500 text-sm mb-4">{plan.desc}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                {plan.period && <span className="text-gray-500 text-sm ml-1">{plan.period}</span>}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, fi) => (
                  <li key={fi} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.action === 'free' && (
                <Link href={`/${locale}/register`} className={`w-full py-3 rounded-xl font-semibold text-center transition-colors ${plan.btnColor}`}>
                  {t('cta')}
                </Link>
              )}
              {plan.action === 'pro' && (
                <Link href={`/${locale}/claim/new`} className={`w-full py-3 rounded-xl font-semibold text-center transition-colors flex items-center justify-center gap-2 ${plan.btnColor}`}>
                  {t('ctaPro')} <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              {plan.action === 'premium' && (
                <button
                  onClick={() => handleStripeCheckout('premium')}
                  disabled={loadingPlan === 'premium'}
                  className={`w-full py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${plan.btnColor} disabled:opacity-60`}
                >
                  {loadingPlan === 'premium' ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><CreditCard className="w-4 h-4" /> {t('ctaPremium')}</>
                  )}
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl p-8 border border-gray-100">
          <h3 className="text-center text-lg font-bold text-gray-900 mb-6">Paiement sécurisé</h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {['Visa', 'Mastercard', 'American Express', 'PayPal', 'Apple Pay', 'Google Pay'].map((method) => (
              <div key={method} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{method}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center gap-2 mt-6 text-sm text-gray-500">
            <Lock className="w-4 h-4 text-green-500" />
            <span>Paiements traités par Stripe  chiffrement SSL 256 bits</span>
          </div>
        </motion.div>

        {/* FAQ pricing */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { q: 'Quand suis-je facturé ?', a: 'Pour le plan Pro, uniquement si nous récupérons votre argent. Pour Premium, abonnement mensuel résiliable à tout moment.' },
            { q: 'Puis-je changer de plan ?', a: 'Oui, vous pouvez passer au plan supérieur à tout moment depuis votre espace client.' },
            { q: 'Quels moyens de paiement acceptez-vous ?', a: 'Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay via Stripe.' },
            { q: 'Y a-t-il un engagement ?', a: 'Aucun engagement pour le plan Premium. Résiliation en 1 clic depuis votre espace client.' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2">{item.q}</h4>
              <p className="text-gray-600 text-sm">{item.a}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
