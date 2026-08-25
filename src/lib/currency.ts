export type Currency = 'EUR' | 'USD' | 'CAD' | 'GBP';
export type Region = 'EU' | 'US' | 'CA' | 'UK';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  locale: string;
}

export interface RegionalConfig {
  region: Region;
  currency: Currency;
  legal: {
    flightRegulation?: string;
    consumerProtection: string[];
    authority: string;
  };
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  EUR: { code: 'EUR', symbol: '€', locale: 'fr-FR' },
  USD: { code: 'USD', symbol: '$', locale: 'en-US' },
  CAD: { code: 'CAD', symbol: 'CA$', locale: 'en-CA' },
  GBP: { code: 'GBP', symbol: '£', locale: 'en-GB' },
};

export const REGIONAL_CONFIG: Record<Region, RegionalConfig> = {
  EU: {
    region: 'EU',
    currency: 'EUR',
    legal: {
      flightRegulation: 'EC Regulation 261/2004',
      consumerProtection: ['SignalConso', 'Europe Consommateurs', 'ECC-Net'],
      authority: 'European Consumer Centre',
    },
  },
  US: {
    region: 'US',
    currency: 'USD',
    legal: {
      flightRegulation: 'DOT (Department of Transportation)',
      consumerProtection: ['FTC', 'CFPB', 'Better Business Bureau'],
      authority: 'Federal Trade Commission',
    },
  },
  CA: {
    region: 'CA',
    currency: 'CAD',
    legal: {
      flightRegulation: 'APPR (Air Passenger Protection Regulations)',
      consumerProtection: ['OTC', 'Competition Bureau', 'Canadian Anti-Fraud Centre'],
      authority: 'Office des transports du Canada',
    },
  },
  UK: {
    region: 'UK',
    currency: 'GBP',
    legal: {
      flightRegulation: 'UK261 (retained EU law)',
      consumerProtection: ['CAA', 'Which?', 'Citizens Advice'],
      authority: 'Civil Aviation Authority',
    },
  },
};

export function getRegionFromLocale(locale: string): Region {
  if (locale.startsWith('en-US')) return 'US';
  if (locale.startsWith('en-CA') || locale.startsWith('fr-CA')) return 'CA';
  if (locale.startsWith('en-GB')) return 'UK';
  return 'EU'; // Default
}

export function getCurrencyForLocale(locale: string): Currency {
  const region = getRegionFromLocale(locale);
  return REGIONAL_CONFIG[region].currency;
}

export function formatCurrency(
  amount: number,
  currency: Currency,
  locale?: string
): string {
  const config = CURRENCIES[currency];
  const displayLocale = locale || config.locale;

  return new Intl.NumberFormat(displayLocale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency
): number {
  // Exchange rates (simplified - in production use real-time API)
  const rates: Record<Currency, number> = {
    EUR: 1,
    USD: 1.08,
    CAD: 1.46,
    GBP: 0.85,
  };

  const inEur = amount / rates[from];
  return inEur * rates[to];
}
