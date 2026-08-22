'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Menu, X, ChevronDown, Globe } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

const LOCALES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

export default function Navigation() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/resources`, label: t('resources') },
    { href: `/${locale}/faq`, label: t('faq') },
    { href: `/${locale}/pricing`, label: t('pricing') },
    { href: `/${locale}/dashboard`, label: t('dashboard') },
  ];

  function switchLocale(newLocale: string) {
    // Replace current locale prefix in pathname
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
    setLangOpen(false);
  }

  const currentLocale = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">Litige</span>
              <span className="text-xl font-bold text-indigo-600">Flow</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-600 hover:text-indigo-600 transition-colors font-medium text-sm">
                {link.label}
              </Link>
            ))}

            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors border border-gray-200 rounded-lg px-3 py-1.5 hover:border-indigo-300"
              >
                <Globe className="w-4 h-4" />
                <span>{currentLocale.flag} {currentLocale.code.toUpperCase()}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  {LOCALES.map((loc) => (
                    <button
                      key={loc.code}
                      onClick={() => switchLocale(loc.code)}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-indigo-50 transition-colors ${loc.code === locale ? 'text-indigo-600 font-semibold bg-indigo-50' : 'text-gray-700'}`}
                    >
                      <span>{loc.flag}</span> {loc.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link href={`/${locale}/claim/new`} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm">
              {t('startClaim')}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block text-gray-600 hover:text-indigo-600 transition-colors font-medium py-2" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Langue</p>
              <div className="grid grid-cols-2 gap-2">
                {LOCALES.map((loc) => (
                  <button
                    key={loc.code}
                    onClick={() => { switchLocale(loc.code); setMobileOpen(false); }}
                    className={`text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 border transition-colors ${loc.code === locale ? 'border-indigo-400 bg-indigo-50 text-indigo-700 font-semibold' : 'border-gray-200 text-gray-600 hover:border-indigo-300'}`}
                  >
                    {loc.flag} {loc.label}
                  </button>
                ))}
              </div>
            </div>
            <Link href={`/${locale}/claim/new`} className="block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors text-center mt-2" onClick={() => setMobileOpen(false)}>
              {t('startClaim')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
