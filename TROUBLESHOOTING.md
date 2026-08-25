# 🔧 Guide de dépannage - LitigeFlow

## Erreurs courantes et solutions

### ❌ React Error #441 (Hydration Mismatch)

**Symptôme**: 
```
Uncaught Error: Minified React error #441
```

**Cause**: Utilisation de `localStorage` ou `window` pendant le Server-Side Rendering (SSR), ce qui crée une différence entre le HTML généré côté serveur et celui généré côté client.

**Solution**: ✅ **RÉSOLU**
- Ajout de guards `isMounted` dans `ChatWidget.tsx` et `ChatPageClient.tsx`
- Les composants retournent `null` jusqu'à ce que le client soit monté
- L'accès à `localStorage` se fait uniquement après le montage

---

### ❌ 500 Internal Server Error sur `/api/visitor`

**Symptôme**:
```
GET /api/visitor 500 (Internal Server Error)
Failed to initialize visitor session: SyntaxError: Unexpected end of JSON input
```

**Cause**: Variable d'environnement `DATABASE_URL` manquante sur Vercel.

**Solution**: 🔧 **À FAIRE**

#### Option 1: Vercel Postgres (Recommandée)
1. Aller sur [vercel.com/dashboard](https://vercel.com)
2. Ouvrir le projet `refundapp`
3. Onglet **Storage** → **Create Database** → **Postgres**
4. Choisir un nom et une région
5. La variable `DATABASE_URL` est **automatiquement ajoutée**
6. L'app se redéploie automatiquement

#### Option 2: Base externe (Supabase, Neon, etc.)
1. Créer une base PostgreSQL sur [supabase.com](https://supabase.com) ou [neon.tech](https://neon.tech)
2. Copier la **Connection String** (format: `postgresql://...`)
3. Sur Vercel:
   - **Settings** → **Environment Variables**
   - Ajouter: `DATABASE_URL` = `postgresql://user:pass@host/db`
4. **Redéployer** l'app (Settings → Deployments → Redeploy)

---

### ⚠️ 404 sur `/fr/dashboard?_rsc=...`

**Symptôme**:
```
GET /fr/dashboard?_rsc=EylmaytQesAzsSpi 404 (Not Found)
```

**Cause**: Prefetch Next.js RSC (React Server Components) qui tente de charger des données en avance.

**Impact**: ⚠️ **Non-critique**
- La page principale se charge correctement
- Seul le prefetch échoue
- N'affecte pas l'expérience utilisateur

**Solution**: Aucune action requise. C'est un comportement normal de Next.js en production.

---

### ⚠️ CORS Error sur `/api/manifest`

**Symptôme**:
```
Access to manifest blocked by CORS policy
Redirected to: https://vercel.com/sso-api?url=...
```

**Cause**: Vercel redirige vers SSO car vous êtes connecté à votre compte Vercel et consultez l'app depuis le même navigateur.

**Impact**: ⚠️ **Non-critique pour les utilisateurs**
- Les visiteurs anonymes ne voient pas cette erreur
- Seul l'administrateur connecté à Vercel la voit
- Le manifest fonctionne pour les vrais utilisateurs

**Solution**: 
- Tester en navigation privée pour voir le comportement réel
- Ou déconnecter de Vercel
- Headers CORS déjà configurés correctement dans `/api/manifest/route.ts`

---

### ⚠️ NPM Allow-Scripts Warnings

**Symptôme**:
```
npm warn allow-scripts 7 packages have install scripts not yet covered
```

**Impact**: ⚠️ **Non-critique**
- Simple warning de sécurité npm
- Les scripts s'exécutent correctement
- N'affecte pas le build

**Solution**: Optionnel
```bash
npm approve-scripts --allow-scripts-pending
```
Ou ignorer - ce n'est qu'un warning informatif.

---

### ⚠️ Prisma Config Deprecation

**Symptôme**:
```
warn The configuration property `package.json#prisma` is deprecated
```

**Impact**: ⚠️ **Non-critique**
- Le build fonctionne correctement
- Simple warning pour futures versions

**Solution**: À faire lors de l'upgrade vers Prisma 7+
- Pour l'instant, garder la config dans `package.json`
- Migration vers `prisma.config.ts` nécessitera Prisma 7

---

## 🎯 Priorités d'action

### 🔴 Critique (À faire maintenant)
1. **Ajouter DATABASE_URL sur Vercel** (voir section 500 Error ci-dessus)

### 🟡 Non-critique (Fonctionnel mais peut être amélioré)
- Hydration errors → ✅ Résolu (commit dc67a4b)
- CORS manifest → Fonctionne pour les utilisateurs finaux
- 404 RSC prefetch → Comportement normal Next.js

### 🟢 Informationnel (Aucune action requise)
- NPM allow-scripts warnings
- Prisma deprecation warning

---

## 📊 État actuel du déploiement

✅ **Fonctionnel**:
- Build réussi sur Vercel
- 62 routes compilées
- Hydration errors résolus
- PWA manifest configuré
- Chat widget opérationnel (frontend)
- Admin panel accessible
- Internationalisation (FR/EN/ES/DE)

⚠️ **En attente de DATABASE_URL**:
- `/api/visitor` (création sessions visiteurs)
- `/api/visitor/messages` (messages chat)
- Admin chat (lecture messages)
- Statistiques visiteurs temps réel

---

## 🚀 Après ajout de DATABASE_URL

Une fois la base connectée, ces fonctionnalités seront automatiquement opérationnelles:

1. ✅ Chat visiteurs → Admin
2. ✅ Statistiques temps réel (nombre de visiteurs)
3. ✅ Historique des conversations
4. ✅ Gestion complète des utilisateurs
5. ✅ CRUD des réclamations
6. ✅ Tracking des visiteurs

---

## 📞 Support

Pour toute question ou problème non couvert ici, vérifiez:
- Les logs Vercel: [Dashboard → Deployments → Logs](https://vercel.com)
- La console du navigateur (F12 → Console)
- Le fichier `DEPLOYMENT.md` pour les instructions de configuration

---

**Dernière mise à jour**: Commit `dc67a4b`
