'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Euro, TrendingUp, Calculator, Info } from 'lucide-react';

const FeeCalculator = () => {
  const [amount, setAmount] = useState(25000);
  const [feeRate] = useState(20);

  const calculateFees = () => {
    const recoveredAmount = amount * 0.85;
    const successChance = Math.min(95, 60 + (amount / 10000));
    const ourFee = recoveredAmount * (feeRate / 100);
    const returnedToYou = recoveredAmount - ourFee;
    return { recoveredAmount, successChance: Math.round(successChance), ourFee, returnedToYou };
  };

  const calc = calculateFees();

  const fmt = (value: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-indigo-100 rounded-lg">
          <Calculator className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Calculateur de remboursement</h3>
          <p className="text-sm text-gray-600">Estimez le montant que vous pourriez récupérer</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-medium text-gray-700">Montant litigieux</label>
          <span className="text-2xl font-bold text-indigo-600">{fmt(amount)}</span>
        </div>
        <input
          type="range" min="1000" max="100000" step="1000" value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>1 000 €</span>
          <span>100 000 €+</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-600">Taux de commission</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{feeRate} %</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span className="text-xs text-gray-600">Probabilité de succès</span>
          </div>
          <div className="text-2xl font-bold text-indigo-600">{calc.successChance} %</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <Euro className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-gray-600">Montant récupéré estimé</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{fmt(calc.recoveredAmount)}</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <Euro className="w-4 h-4 text-purple-600" />
            <span className="text-xs text-gray-600">Notre commission</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">{fmt(calc.ourFee)}</div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Euro className="w-5 h-5" />
              <span className="text-sm font-medium text-indigo-100">Montant reversé</span>
            </div>
            <div className="text-3xl font-bold">{fmt(calc.returnedToYou)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-indigo-100 mb-1">Taux de récupération</div>
            <div className="text-2xl font-bold">85 %</div>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 flex items-start space-x-2 bg-blue-50 rounded-lg p-3">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800">
          Estimation basée sur les données historiques. Le montant réel peut varier selon la complexité du dossier. Aucune commission n'est prélevée sans récupération effective.
        </p>
      </div>
    </div>
  );
};

export default FeeCalculator;
