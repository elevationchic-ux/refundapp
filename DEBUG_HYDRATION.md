# Debug React Hydration Error #441

## Test en local
```bash
npm run dev
```

Ouvrir http://localhost:3000 et vérifier la console.

## Composants suspects

1. **HomeClient** - useCountUp animations
   - Fix appliqué: isMounted guard
   - Status: ✅ Devrait être OK

2. **ChatWidget** - localStorage
   - Fix appliqué: isMounted guard + return null
   - Status: ✅ Devrait être OK

3. **ChatPageClient** - localStorage
   - Fix appliqué: isMounted guard
   - Status: ✅ Devrait être OK

4. **Navigation** - useState for mobile menu
   - Pas de localStorage, devrait être OK
   - Status: ✅ Probablement OK

5. **Footer** - Client component
   - À vérifier si utilise Date.now() ou données dynamiques

## Causes possibles restantes

### 1. Framer Motion animations
Composants utilisant framer-motion qui peuvent s'initialiser différemment:
- HomeClient
- LegalLayout
- scam-investigation-review page

### 2. useLocale() ou useTranslations()
Si next-intl retourne des valeurs différentes côté serveur vs client.

### 3. Date/Time rendering
Tout composant qui affiche une date/heure peut causer hydration mismatch si:
- Le serveur génère une date
- Le client régénère une date différente
- Exemples: relativeTime(), new Date(), timestamps

## Solution si l'erreur persiste

### Option 1: Identifier le composant exact
Activer le mode dev de React pour voir le message complet:
```bash
# Modifier next.config.ts temporairement
reactStrictMode: false,
```

### Option 2: Supprimer l'hydration pour ce composant
Ajouter `suppressHydrationWarning` sur le composant problématique:
```tsx
<div suppressHydrationWarning>
  {/* contenu */}
</div>
```

### Option 3: Désactiver le SSR pour ce composant
```tsx
import dynamic from 'next/dynamic';

const ProblematicComponent = dynamic(
  () => import('./ProblematicComponent'),
  { ssr: false }
);
```

## URLs de test

- Production: https://refundapp-one.vercel.app
- Preview (peut être ancien): https://refundapp-xxx-evolution14.vercel.app

⚠️ **Toujours tester sur l'URL de production principale!**
