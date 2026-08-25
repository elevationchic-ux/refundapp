'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { 
  ShoppingBag, 
  Plane, 
  AlertTriangle, 
  DollarSign, 
  Heart, 
  FileText,
  CheckCircle,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getRegionFromLocale, REGIONAL_CONFIG, type Region } from '@/lib/currency';

const SITUATION_ICONS = {
  merchant: ShoppingBag,
  transport: Plane,
  scam: AlertTriangle,
  cashback: DollarSign,
  health: Heart,
  tax: FileText,
};

type SituationType = keyof typeof SITUATION_ICONS;

interface Remedy {
  name: string;
  url: string;
  official: boolean;
  description: string;
}

export default function OrienteurClient() {
  const t = useTranslations('orienteur');
  const locale = useLocale();
  const [selectedSituation, setSelectedSituation] = useState<SituationType | null>(null);
  const region = getRegionFromLocale(locale) as Region;
  const regionalConfig = REGIONAL_CONFIG[region];

  const getRemediesForSituation = (situation: SituationType): Remedy[] => {
    const remedies: Record<SituationType, Record<Region, Remedy[]>> = {
      merchant: {
        EU: [
          { name: 'SignalConso', url: 'https://signal.conso.gouv.fr', official: true, description: 'Plateforme officielle française' },
          { name: 'Europe Consommateurs', url: 'https://www.europe-consommateurs.eu', official: true, description: 'Réseau européen' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Accompagnement personnalisé' },
        ],
        US: [
          { name: 'FTC Complaint', url: 'https://reportfraud.ftc.gov', official: true, description: 'Federal Trade Commission' },
          { name: 'Better Business Bureau', url: 'https://www.bbb.org', official: true, description: 'Business dispute resolution' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Personalized support' },
        ],
        CA: [
          { name: 'Competition Bureau', url: 'https://www.bureaudelaconcurrence.gc.ca', official: true, description: 'Bureau officiel canadien' },
          { name: 'BBB Canada', url: 'https://www.bbb.org/ca', official: true, description: 'Résolution des litiges' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Accompagnement personnalisé' },
        ],
        UK: [
          { name: 'Citizens Advice', url: 'https://www.citizensadvice.org.uk', official: true, description: 'UK consumer advice' },
          { name: 'Which?', url: 'https://www.which.co.uk', official: true, description: 'Consumer champion' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Personalized support' },
        ],
      },
      transport: {
        EU: [
          { name: 'AirHelp', url: 'https://www.airhelp.com', official: false, description: 'Indemnisation vol retardé (CE 261/2004)' },
          { name: 'DGAC', url: 'https://www.ecologie.gouv.fr/direction-generale-laviation-civile-dgac', official: true, description: 'Autorité française' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Jusqu\'à 600 € d\'indemnisation' },
        ],
        US: [
          { name: 'DOT Aviation Consumer', url: 'https://www.transportation.gov/airconsumer', official: true, description: 'Department of Transportation' },
          { name: 'AirHelp', url: 'https://www.airhelp.com', official: false, description: 'Flight compensation claims' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Flight delay compensation' },
        ],
        CA: [
          { name: 'CTA (OTC)', url: 'https://otc-cta.gc.ca', official: true, description: 'Office des transports du Canada' },
          { name: 'AirHelp', url: 'https://www.airhelp.com', official: false, description: 'Indemnisation retards de vol' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Compensation RPPA' },
        ],
        UK: [
          { name: 'CAA', url: 'https://www.caa.co.uk', official: true, description: 'Civil Aviation Authority' },
          { name: 'AirHelp', url: 'https://www.airhelp.com', official: false, description: 'Flight compensation (UK261)' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Up to £520 compensation' },
        ],
      },
      scam: {
        EU: [
          { name: 'Pharos', url: 'https://www.internet-signalement.gouv.fr', official: true, description: 'Signalement cybercriminalité' },
          { name: 'Perceval', url: 'https://www.service-public.fr/particuliers/vosdroits/R46526', official: true, description: 'Victime escroquerie' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Récupération fraude bancaire' },
        ],
        US: [
          { name: 'IC3 (FBI)', url: 'https://www.ic3.gov', official: true, description: 'Internet Crime Complaint Center' },
          { name: 'FTC Report Fraud', url: 'https://reportfraud.ftc.gov', official: true, description: 'Federal Trade Commission' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Chargeback & fraud recovery' },
        ],
        CA: [
          { name: 'Canadian Anti-Fraud Centre', url: 'https://www.antifraudcentre-centreantifraude.ca', official: true, description: 'Centre antifraude' },
          { name: 'CAFC Report', url: 'https://www.antifraudcentre-centreantifraude.ca/report-signalez-eng.htm', official: true, description: 'Signalement fraude' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Récupération fraude' },
        ],
        UK: [
          { name: 'Action Fraud', url: 'https://www.actionfraud.police.uk', official: true, description: 'UK fraud reporting' },
          { name: 'Citizens Advice Scams', url: 'https://www.citizensadvice.org.uk/consumer/scams', official: true, description: 'Scam advice' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Fraud recovery support' },
        ],
      },
      cashback: {
        EU: [
          { name: 'iGraal', url: 'https://fr.igraal.com', official: false, description: 'Cashback shopping' },
          { name: 'Poulpeo', url: 'https://www.poulpeo.com', official: false, description: 'Cashback français' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Réclamation cashback non versé' },
        ],
        US: [
          { name: 'Rakuten', url: 'https://www.rakuten.com', official: false, description: 'Cash back rewards' },
          { name: 'Honey', url: 'https://www.joinhoney.com', official: false, description: 'Automatic coupons' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Cashback claim support' },
        ],
        CA: [
          { name: 'Rakuten Canada', url: 'https://www.rakuten.ca', official: false, description: 'Cashback canadien' },
          { name: 'Great Canadian Rebates', url: 'https://www.greatcanadianrebates.ca', official: false, description: 'Remises canadiennes' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Réclamation cashback' },
        ],
        UK: [
          { name: 'TopCashback', url: 'https://www.topcashback.co.uk', official: false, description: 'UK cashback' },
          { name: 'Quidco', url: 'https://www.quidco.com', official: false, description: 'Cashback site' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Cashback claim' },
        ],
      },
      health: {
        EU: [
          { name: 'Ameli', url: 'https://www.ameli.fr', official: true, description: 'Assurance Maladie française' },
          { name: 'CPAM', url: 'https://www.ameli.fr/assure/droits-demarches', official: true, description: 'Caisse primaire' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Litige remboursement santé' },
        ],
        US: [
          { name: 'Medicare', url: 'https://www.medicare.gov', official: true, description: 'Federal health insurance' },
          { name: 'Healthcare.gov', url: 'https://www.healthcare.gov', official: true, description: 'Health insurance marketplace' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Insurance claim dispute' },
        ],
        CA: [
          { name: 'Health Canada', url: 'https://www.canada.ca/en/health-canada.html', official: true, description: 'Santé Canada' },
          { name: 'Provincial Health', url: 'https://www.canada.ca/en/health-canada/services/health-care-system.html', official: true, description: 'Régimes provinciaux' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Litige remboursement santé' },
        ],
        UK: [
          { name: 'NHS', url: 'https://www.nhs.uk', official: true, description: 'National Health Service' },
          { name: 'NHS Complaints', url: 'https://www.nhs.uk/using-the-nhs/about-the-nhs/how-to-complain-to-the-nhs', official: true, description: 'Healthcare complaints' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Healthcare refund dispute' },
        ],
      },
      tax: {
        EU: [
          { name: 'Impots.gouv.fr', url: 'https://www.impots.gouv.fr', official: true, description: 'Administration fiscale française' },
          { name: 'Service Public', url: 'https://www.service-public.fr/particuliers/vosdroits/N247', official: true, description: 'Remboursement impôts' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Litige fiscal' },
        ],
        US: [
          { name: 'IRS', url: 'https://www.irs.gov', official: true, description: 'Internal Revenue Service' },
          { name: 'IRS Refund Status', url: 'https://www.irs.gov/refunds', official: true, description: 'Tax refund tracking' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Tax refund dispute' },
        ],
        CA: [
          { name: 'CRA', url: 'https://www.canada.ca/en/revenue-agency.html', official: true, description: 'Agence du revenu du Canada' },
          { name: 'CRA Refund', url: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/refunds.html', official: true, description: 'Suivi remboursement' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Litige fiscal' },
        ],
        UK: [
          { name: 'HMRC', url: 'https://www.gov.uk/government/organisations/hm-revenue-customs', official: true, description: 'HM Revenue & Customs' },
          { name: 'Tax Refund', url: 'https://www.gov.uk/tax-overpayments-and-underpayments', official: true, description: 'Tax refund claims' },
          { name: 'LitigeFlow', url: '/claim/new', official: false, description: 'Tax dispute support' },
        ],
      },
    };

    return remedies[situation][region] || remedies[situation].EU;
  };

  const situations = Object.keys(SITUATION_ICONS) as SituationType[];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('title')}</h1>
          <p className="text-lg text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('question')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {situations.map((situation) => {
              const Icon = SITUATION_ICONS[situation];
              const isSelected = selectedSituation === situation;
              
              return (
                <button
                  key={situation}
                  onClick={() => setSelectedSituation(situation)}
                  className={`p-6 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow'
                  }`}
                >
                  <Icon className={`h-8 w-8 mb-3 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                  <div className="font-medium text-gray-900">
                    {t(`situations.${situation}`)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedSituation && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              {t('results')}
            </h2>
            
            {regionalConfig.legal.flightRegulation && selectedSituation === 'transport' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>{region} {t('detail')}</strong> {regionalConfig.legal.flightRegulation}
                </p>
              </div>
            )}

            <div className="space-y-3">
              {getRemediesForSituation(selectedSituation).map((remedy, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{remedy.name}</h3>
                          {remedy.official && (
                            <Badge variant="default" className="bg-green-600">
                              {t('official')}
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">{remedy.description}</p>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <a href={remedy.url} target={remedy.url.startsWith('http') ? '_blank' : undefined} rel={remedy.url.startsWith('http') ? 'noopener noreferrer' : undefined}>
                          {remedy.url.startsWith('http') ? (
                            <ExternalLink className="h-4 w-4" />
                          ) : (
                            <ArrowRight className="h-4 w-4" />
                          )}
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{t('cta')}</h3>
                  <p className="mb-4 text-blue-100">
                    {region === 'US' ? 'No win, no fee' : region === 'CA' ? 'Aucuns frais anticipés' : 'Aucune avance de frais'}  
                    • 20% commission on success
                  </p>
                  <Button asChild size="lg" variant="outline">
                    <a href="/claim/new">
                      {t('cta')} <ArrowRight className="h-5 w-5 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
