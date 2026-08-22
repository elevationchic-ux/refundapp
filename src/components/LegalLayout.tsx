'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

interface Section { heading: string; body: string }

export default function LegalLayout({ title, sections, lastUpdated }: {
  title: string;
  sections: Section[];
  lastUpdated?: string;
}) {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <FileText className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
          {lastUpdated && <p className="text-sm text-gray-500">Dernière mise à jour : {lastUpdated}</p>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {sections.map((section, i) => (
            <div key={i} className={`p-8 ${i < sections.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <h2 className="text-lg font-bold text-gray-900 mb-3">{section.heading}</h2>
              <p className="text-gray-600 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </motion.div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Pour toute question : <a href="mailto:legal@litigeflow.com" className="text-indigo-600 hover:underline">legal@litigeflow.com</a></p>
        </div>
      </div>
    </div>
  );
}
