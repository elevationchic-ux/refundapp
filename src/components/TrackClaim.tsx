'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, FileText, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

const TrackClaim = () => {
  const [caseReference, setCaseReference] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitStatus(caseReference && email.includes('@') ? 'success' : 'error');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-indigo-100 rounded-lg">
          <Search className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Suivre mon dossier</h3>
          <p className="text-sm text-gray-600">Entrez vos informations pour consulter l'état de votre dossier</p>
        </div>
      </div>

      {submitStatus === 'idle' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="caseReference" className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de dossier
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text" id="caseReference" value={caseReference}
                onChange={(e) => setCaseReference(e.target.value)}
                placeholder="ex : LF-2024-12345"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Adresse e-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email" id="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.fr"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit" disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Recherche en cours…</span>
              </>
            ) : (
              <>
                <span>Suivre mon dossier</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      )}

      {submitStatus === 'success' && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h4 className="font-bold text-green-900">Dossier trouvé</h4>
              <p className="text-sm text-green-700">Référence : {caseReference}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-green-200">
              <span className="text-sm text-green-800">Statut</span>
              <span className="font-semibold text-green-900">En cours d'instruction</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-green-200">
              <span className="text-sm text-green-800">Étape</span>
              <span className="font-semibold text-green-900">Liaison bancaire</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-green-800">Dernière mise à jour</span>
              <span className="font-semibold text-green-900">Il y a 2 heures</span>
            </div>
          </div>
          <button onClick={() => setSubmitStatus('idle')} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors">
            Suivre un autre dossier
          </button>
        </motion.div>
      )}

      {submitStatus === 'error' && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div>
              <h4 className="font-bold text-red-900">Dossier introuvable</h4>
              <p className="text-sm text-red-700">Vérifiez votre numéro de dossier et votre e-mail</p>
            </div>
          </div>
          <button onClick={() => setSubmitStatus('idle')} className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors">
            Réessayer
          </button>
        </motion.div>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-2">Pas encore de dossier ?</p>
        <a href="/claim/new" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm inline-flex items-center space-x-1">
          <span>Déposer un nouveau dossier</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default TrackClaim;
