'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TrackerClient() {
  const t = useTranslations('tracker');
  const [reference, setReference] = useState('');
  const [email, setEmail] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<'found' | 'notFound' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Demo: if reference starts with LF, show found
    if (reference.toUpperCase().startsWith('LF-')) {
      setResult('found');
    } else {
      setResult('notFound');
    }
    
    setSearching(false);
  };

  const reset = () => {
    setReference('');
    setEmail('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('title')}</h1>
          <p className="text-lg text-gray-600">{t('subtitle')}</p>
        </div>

        {result === null ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                {t('title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('reference')}
                  </label>
                  <input
                    type="text"
                    id="reference"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder={t('referencePlaceholder')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={searching}
                >
                  {searching ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      {t('searching')}
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      {t('submit')}
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600 mb-2">{t('noCase')}</p>
                <Button variant="outline" asChild>
                  <a href="/claim/new">
                    {t('newClaim')} <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : result === 'found' ? (
          <Card className="border-green-500">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-6 w-6" />
                {t('found')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="font-medium text-gray-700">{t('reference')}:</span>
                  <span className="text-gray-900">{reference}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="font-medium text-gray-700">{t('status')}:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {t('inProgress')}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="font-medium text-gray-700">{t('stage')}:</span>
                  <span className="text-gray-900">{t('bankLiaison')}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="font-medium text-gray-700">{t('lastUpdate')}:</span>
                  <span className="text-gray-600 text-sm">{t('hoursAgo')}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button onClick={reset} variant="outline" className="flex-1">
                  {t('trackAnother')}
                </Button>
                <Button asChild className="flex-1">
                  <a href="/dashboard">{t('viewCase')}</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-red-500">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center gap-2 text-red-700">
                <XCircle className="h-6 w-6" />
                {t('notFound')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-6">{t('notFoundDesc')}</p>
              
              <div className="flex gap-3">
                <Button onClick={reset} variant="outline" className="flex-1">
                  {t('retry')}
                </Button>
                <Button asChild className="flex-1">
                  <a href="/claim/new">{t('newClaim')}</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
