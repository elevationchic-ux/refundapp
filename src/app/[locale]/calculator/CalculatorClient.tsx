'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Calculator, TrendingUp, DollarSign, Percent, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCurrencyForLocale, formatCurrency, type Currency } from '@/lib/currency';

export default function CalculatorClient() {
  const t = useTranslations('calculator');
  const locale = useLocale();
  const currency = getCurrencyForLocale(locale);
  
  const [amount, setAmount] = useState(1000);
  const [commission, setCommission] = useState(20);
  const [successRate, setSuccessRate] = useState(75);

  const estimated = amount * (successRate / 100);
  const ourFee = estimated * (commission / 100);
  const returned = estimated - ourFee;
  const recoveryRate = (returned / amount) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Calculator className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('title')}</h1>
          <p className="text-lg text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Inputs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                {t('amount')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('amount')}
                </label>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center mt-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="text-2xl font-bold text-blue-600 bg-transparent border-b-2 border-blue-600 text-center w-32 focus:outline-none"
                  />
                  <span className="text-2xl font-bold text-gray-600 ml-2">
                    {currency}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  {t('commission')}
                </label>
                <input
                  type="range"
                  min="10"
                  max="30"
                  step="1"
                  value={commission}
                  onChange={(e) => setCommission(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center mt-2">
                  <span className="text-xl font-semibold text-gray-900">{commission}%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  {t('successRate')}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={successRate}
                  onChange={(e) => setSuccessRate(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center mt-2">
                  <span className="text-xl font-semibold text-gray-900">{successRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5" />
                {t('estimated')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-sm text-blue-100 mb-1">{t('estimated')}</div>
                <div className="text-3xl font-bold">
                  {formatCurrency(estimated, currency, locale)}
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-sm text-blue-100 mb-1">{t('ourFee')}</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(ourFee, currency, locale)}
                </div>
                <div className="text-xs text-blue-200 mt-1">
                  {commission}% of recovered amount
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 text-gray-900">
                <div className="text-sm text-gray-600 mb-1">{t('returned')}</div>
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(returned, currency, locale)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {t('recoveryRate')}: {recoveryRate.toFixed(0)}%
                </div>
              </div>

              <Button asChild className="w-full bg-white text-blue-600 hover:bg-blue-50" size="lg">
                <a href="/claim/new">
                  {t('cta')} →
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <p className="text-sm text-yellow-800">
              ⚠️ {t('disclaimer')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
