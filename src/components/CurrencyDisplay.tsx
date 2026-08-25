'use client';

import { useLocale } from 'next-intl';
import { getCurrencyForLocale, formatCurrency } from '@/lib/currency';

interface CurrencyDisplayProps {
  amount: number;
  className?: string;
}

export function CurrencyDisplay({ amount, className = '' }: CurrencyDisplayProps) {
  const locale = useLocale();
  const currency = getCurrencyForLocale(locale);
  
  return (
    <span className={className}>
      {formatCurrency(amount, currency, locale)}
    </span>
  );
}

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function CurrencyInput({ 
  value, 
  onChange, 
  min = 0, 
  max = 100000,
  step = 1,
  className = '' 
}: CurrencyInputProps) {
  const locale = useLocale();
  const currency = getCurrencyForLocale(locale);
  
  return (
    <div className={`relative ${className}`}>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full px-4 py-2 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
        {currency}
      </span>
    </div>
  );
}
