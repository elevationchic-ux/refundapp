"use client";

import { useActionState, useRef, useState } from "react";
import { createClaim, type ClaimFormState } from "@/app/actions/claims";
import { formatAmount } from "@/lib/claims";

const STEPS = ["Transaction", "Preuves", "Récapitulatif"] as const;

const initialState: ClaimFormState = {};

export function ClaimWizard() {
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [transaction, setTransaction] = useState({
    amount: "",
    date: "",
    reference: "",
    description: "",
  });
  const [stepError, setStepError] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState(createClaim, initialState);

  function validateStep1() {
    const amount = Number(transaction.amount);
    if (!transaction.amount || Number.isNaN(amount) || amount <= 0) {
      return "Veuillez saisir un montant valide supérieur à 0.";
    }
    if (!transaction.date) {
      return "Veuillez indiquer la date de la transaction.";
    }
    if (new Date(transaction.date) > new Date()) {
      return "La date ne peut pas être dans le futur.";
    }
    if (transaction.description.trim().length < 20) {
      return "Décrivez le litige en au moins 20 caractères.";
    }
    return null;
  }

  function next() {
    if (step === 0) {
      const error = validateStep1();
      if (error) {
        setStepError(error);
        return;
      }
    }
    setStepError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setStepError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  function onFilesSelected(list: FileList | null) {
    if (!list) return;
    const selected = Array.from(list);
    if (selected.length > 5) {
      setStepError("Vous pouvez joindre au maximum 5 fichiers.");
      return;
    }
    const tooBig = selected.find((f) => f.size > 5 * 1024 * 1024);
    if (tooBig) {
      setStepError(`Le fichier « ${tooBig.name} » dépasse 5 Mo.`);
      return;
    }
    setStepError(null);
    setFiles(selected);
  }

  const inputClass =
    "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

  return (
    <form action={formAction} className="mt-6">
      {/* Indicateur d'étapes */}
      <ol className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                i <= step ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`text-sm ${i <= step ? "text-slate-900" : "text-slate-400"}`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="h-px flex-1 bg-slate-200" />}
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Étape 1 : informations de la transaction */}
        <div className={step === 0 ? "space-y-4" : "hidden"}>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700">
              Montant contesté (€)
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={transaction.amount}
              onChange={(e) =>
                setTransaction((t) => ({ ...t, amount: e.target.value }))
              }
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700">
              Date de la transaction
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={transaction.date}
              onChange={(e) => setTransaction((t) => ({ ...t, date: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="reference"
              className="block text-sm font-medium text-slate-700"
            >
              Référence de la transaction (optionnel)
            </label>
            <input
              id="reference"
              name="reference"
              type="text"
              maxLength={100}
              placeholder="Ex. : TXN-2024-00123"
              value={transaction.reference}
              onChange={(e) =>
                setTransaction((t) => ({ ...t, reference: e.target.value }))
              }
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700"
            >
              Description du litige
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              maxLength={5000}
              placeholder="Décrivez ce qui s'est passé : produit non reçu, double prélèvement…"
              value={transaction.description}
              onChange={(e) =>
                setTransaction((t) => ({ ...t, description: e.target.value }))
              }
              className={inputClass}
            />
          </div>
        </div>

        {/* Étape 2 : upload de preuves */}
        <div className={step === 1 ? "space-y-4" : "hidden"}>
          <div>
            <label htmlFor="evidence" className="block text-sm font-medium text-slate-700">
              Pièces justificatives
            </label>
            <p className="mt-1 text-xs text-slate-500">
              Jusqu&apos;à 5 fichiers (PNG, JPEG, WEBP ou PDF), 5 Mo maximum chacun.
            </p>
            <input
              id="evidence"
              name="evidence"
              type="file"
              multiple
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/webp,application/pdf"
              onChange={(e) => onFilesSelected(e.target.files)}
              className="mt-2 block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          {files.length > 0 && (
            <ul className="space-y-1 text-sm text-slate-600">
              {files.map((f) => (
                <li key={f.name} className="flex justify-between rounded-md bg-slate-50 px-3 py-2">
                  <span className="truncate">{f.name}</span>
                  <span className="ml-2 shrink-0 text-slate-400">
                    {(f.size / 1024).toFixed(0)} Ko
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Étape 3 : récapitulatif */}
        <div className={step === 2 ? "space-y-4" : "hidden"}>
          <dl className="divide-y divide-slate-100 text-sm">
            <div className="flex justify-between py-2">
              <dt className="text-slate-500">Montant contesté</dt>
              <dd className="font-medium text-slate-900">
                {transaction.amount ? formatAmount(Number(transaction.amount)) : "—"}
              </dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-slate-500">Date de la transaction</dt>
              <dd className="font-medium text-slate-900">
                {transaction.date
                  ? new Date(transaction.date).toLocaleDateString("fr-FR")
                  : "—"}
              </dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-slate-500">Référence</dt>
              <dd className="font-medium text-slate-900">
                {transaction.reference || "—"}
              </dd>
            </div>
            <div className="py-2">
              <dt className="text-slate-500">Description</dt>
              <dd className="mt-1 whitespace-pre-wrap text-slate-900">
                {transaction.description || "—"}
              </dd>
            </div>
            <div className="py-2">
              <dt className="text-slate-500">Preuves jointes</dt>
              <dd className="mt-1 text-slate-900">
                {files.length > 0 ? files.map((f) => f.name).join(", ") : "Aucune"}
              </dd>
            </div>
          </dl>
          <p className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">
            En validant, vous confirmez l&apos;exactitude des informations fournies.
          </p>
        </div>

        {(stepError || state.error) && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {stepError ?? state.error}
          </p>
        )}
        {state.fieldErrors && (
          <ul className="mt-4 space-y-1 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {Object.values(state.fieldErrors)
              .flat()
              .map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
          </ul>
        )}

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={back}
            disabled={step === 0 || pending}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:invisible"
          >
            Précédent
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Suivant
            </button>
          ) : (
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {pending ? "Envoi en cours…" : "Soumettre le litige"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
