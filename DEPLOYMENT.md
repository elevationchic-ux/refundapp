# Déploiement LitigeFlow sur Vercel

## Variables d'environnement requises

### 1. Base de données (CRITIQUE)
```
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
```
**Important**: Sans cette variable, les APIs Prisma échoueront avec une erreur 500.

Vous pouvez utiliser:
- **Vercel Postgres** (recommandé pour Vercel)
- **Supabase** (gratuit, facile à setup)
- **Neon** (serverless PostgreSQL)
- Tout autre service PostgreSQL

### 2. Authentification
```
AUTH_SECRET=<généré avec: openssl rand -base64 32>
```

### 3. Site URL
```
NEXT_PUBLIC_SITE_URL=https://votre-domaine.vercel.app
```

### 4. Stripe (optionnel pour commencer)
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PREMIUM=price_...
```

## Configuration Vercel

### Étape 1: Ajouter une base de données

**Option A: Vercel Postgres (Recommandé)**
1. Aller dans votre projet Vercel
2. Storage → Create Database → Postgres
3. La variable `DATABASE_URL` sera automatiquement ajoutée

**Option B: Supabase (Gratuit)**
1. Créer un compte sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Copier la "Connection String" depuis Settings → Database
4. Ajouter la variable dans Vercel: Settings → Environment Variables

### Étape 2: Configurer les variables d'environnement

Dans Vercel Dashboard → Settings → Environment Variables, ajouter:

```
DATABASE_URL=<votre URL PostgreSQL>
AUTH_SECRET=<généré avec openssl rand -base64 32>
NEXT_PUBLIC_SITE_URL=https://votre-app.vercel.app
```

### Étape 3: Exécuter les migrations Prisma

Après avoir ajouté `DATABASE_URL`, redéployer l'app pour que Prisma génère les tables.

Si besoin de lancer les migrations manuellement:
```bash
npx prisma migrate deploy
npx prisma db seed  # Pour les données de test
```

## Erreurs courantes

### 1. Erreur 500 sur `/api/visitor`
**Cause**: `DATABASE_URL` manquant ou invalide
**Solution**: Vérifier que la variable existe et que la DB est accessible

### 2. Erreur 404 sur `/fr/claim/new`
**Cause**: Route non localisée
**Solution**: Utiliser `/claim/new` au lieu de `/[locale]/claim/new`

### 3. CORS sur `/api/manifest`
**Cause**: Headers CORS déjà ajoutés dans le code
**Solution**: Rien à faire, ça devrait fonctionner

### 4. React Hydration Error #441
**Cause**: Différence entre le HTML server-side et client-side
**Solution**: Vérifier les composants utilisant `localStorage` ou `window`

## Architecture du projet

### Routes principales
- `/[locale]` - Pages internationalisées (FR/EN/ES/DE)
- `/[locale]/dashboard` - Espace utilisateur (authentifié)
- `/[locale]/claim/new` - Créer un dossier
- `/chat` - Page chat indépendante
- `/admin/*` - Panel administrateur

### APIs
- `/api/visitor` - Gestion des sessions visiteurs (chat)
- `/api/visitor/messages` - Messages du chat
- `/api/admin/*` - APIs administration
- `/api/stripe/*` - Webhooks et paiements Stripe

### Features
- ✅ Internationalisation (4 langues)
- ✅ Multi-devises (EUR/USD/CAD/GBP)
- ✅ Chat en temps réel (SSE)
- ✅ PWA avec manifest dynamique
- ✅ Admin panel complet (CRUD)
- ✅ Stats visiteurs temps réel

## Support

Pour toute question sur le déploiement, vérifier:
1. Les logs Vercel (Runtime Logs)
2. La console navigateur (erreurs JS)
3. Les variables d'environnement sont bien définies
