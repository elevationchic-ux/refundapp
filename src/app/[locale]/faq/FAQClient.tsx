'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface FAQ { question: string; answer: string }
interface Props {
  faqs: FAQ[];
  title: string;
  subtitle: string;
  stillQuestion: string;
  stillDesc: string;
  ctaClaim: string;
  ctaResources: string;
  locale: string;
}

export default function FAQClient({ faqs, title, subtitle, stillQuestion, stillDesc, ctaClaim, ctaResources, locale }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <HelpCircle className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <motion.div animate={{ rotate: openIndex === index ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-1 text-gray-600 leading-relaxed border-t border-gray-100">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">{stillQuestion}</h2>
          <p className="text-indigo-100 mb-6">{stillDesc}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/claim/new`} className="bg-white hover:bg-gray-100 text-indigo-600 px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center gap-2">
              {ctaClaim} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={`/${locale}/resources`} className="bg-indigo-800 hover:bg-indigo-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              {ctaResources}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
