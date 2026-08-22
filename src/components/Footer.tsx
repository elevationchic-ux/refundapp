'use client';

import Link from 'next/link';
import { Shield, Mail, Phone } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">Litige</span>
                <span className="text-xl font-bold text-indigo-400">Flow</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">{t('tagline')}</p>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Shield className="w-4 h-4" />
              <span>{t('gdpr')}</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('nav')}</h3>
            <ul className="space-y-2">
              <li><Link href={`/${locale}`} className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href={`/${locale}/resources`} className="text-gray-400 hover:text-white transition-colors">{t('nav')}</Link></li>
              <li><Link href={`/${locale}/faq`} className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href={`/${locale}/pricing`} className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('services')}</h3>
            <ul className="space-y-2">
              <li><Link href={`/${locale}/claim/new`} className="text-gray-400 hover:text-white transition-colors">{t('submitClaim')}</Link></li>
              <li><Link href={`/${locale}/dashboard`} className="text-gray-400 hover:text-white transition-colors">{t('mySpace')}</Link></li>
              <li><Link href={`/${locale}/login`} className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
              <li><Link href={`/${locale}/register`} className="text-gray-400 hover:text-white transition-colors">Register</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('contact')}</h3>
            <ul className="space-y-3 mb-4">
              <li className="flex items-start space-x-2">
                <Mail className="w-5 h-5 text-indigo-400 mt-0.5" />
                <span className="text-gray-400">support@litigeflow.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="w-5 h-5 text-indigo-400 mt-0.5" />
                <span className="text-gray-400">+33 (0)1 23 45 67 89</span>
              </li>
            </ul>
            <div className="p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">{t('warning')}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} LitigeFlow. {t('rights')}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href={`/${locale}/privacy`} className="text-gray-400 hover:text-white transition-colors">{t('privacy')}</Link>
              <Link href={`/${locale}/terms`} className="text-gray-400 hover:text-white transition-colors">{t('terms')}</Link>
              <Link href={`/${locale}/cookies`} className="text-gray-400 hover:text-white transition-colors">{t('cookies')}</Link>
              <Link href={`/${locale}/legal`} className="text-gray-400 hover:text-white transition-colors">{t('legal')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
