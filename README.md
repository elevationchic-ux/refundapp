# LitigeFlow  Gestion des remboursements et litiges

Application Next.js (App Router) de gestion des demandes de remboursement et des litiges : soumission multi-étapes avec pièces justificatives, suivi client et back-office d'administration.

## Stack

- **Next.js 16** (App Router, Server Actions) + **TypeScript**
- **Tailwind CSS 4**
- **Prisma** + **PostgreSQL**
- Authentification par sessions JWT signées (cookie `httpOnly`), mots de passe hachés avec bcrypt
- Rôles : `CLIENT`, `AGENT`, `ADMIN`

## Fonctionnalités

- `/claim/new`  tunnel de soumission en 3 étapes : informations de la transaction, upload de preuves (PNG/JPEG/WEBP/PDF, 5 fichiers max, 5 Mo chacun), récapitulatif.
- `/dashboard`  historique des litiges du client sous forme de cartes avec badges de statut (`PENDING`, `INVESTIGATING`, `RESOLVED`, `REJECTED`).
- `/admin`  tableau de données (tri, recherche, filtre par statut) réservé aux rôles `AGENT`/`ADMIN` : changement de statut et assignation d'agents (assignation réservée aux `ADMIN`).
- `/login`, `/register`  authentification (inscription en tant que `CLIENT`).
- Les pièces justificatives sont stockées en base (bytea) et servies via `/api/evidence/[id]` avec contrôle d'accès (propriétaire ou staff).

## Démarrage local

1. Démarrer une base PostgreSQL, par exemple :

   ```bash
   docker run -d --name claims-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=claims -p 5432:5432 postgres:16-alpine
   ```

2. Configurer l'environnement :

   ```bash
   cp .env.example .env
   # renseigner DATABASE_URL et AUTH_SECRET (openssl rand -base64 32)
   ```

3. Installer, migrer, seeder, lancer :

   ```bash
   npm install
   npx prisma migrate dev
   npm run db:seed
   npm run dev
   ```

### Comptes de démonstration (seed)

| Rôle   | E-mail              | Mot de passe   |
| ------ | ------------------- | -------------- |
| ADMIN  | admin@example.com   | `Password123!` |
| AGENT  | agent@example.com   | `Password123!` |
| CLIENT | client@example.com  | `Password123!` |

## Déploiement sur Vercel

1. Créer une base PostgreSQL managée (Vercel Postgres/Neon, Supabase…).
2. Importer le dépôt dans Vercel  le build exécute automatiquement `prisma generate && next build` (script `build`), et `postinstall` régénère le client Prisma.
3. Définir les variables d'environnement du projet :
   - `DATABASE_URL`  chaîne de connexion PostgreSQL (avec `?sslmode=require`)
   - `AUTH_SECRET`  `openssl rand -base64 32`
4. Appliquer les migrations sur la base de production :

   ```bash
   DATABASE_URL="postgresql://…" npx prisma migrate deploy
   ```

   (optionnel : `npm run db:seed` pour les comptes de démonstration)

## Scripts

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Serveur de développement             |
| `npm run build`   | `prisma generate` + build production |
| `npm run lint`    | ESLint                               |
| `npm run db:migrate` | `prisma migrate dev`              |
| `npm run db:deploy`  | `prisma migrate deploy`           |
| `npm run db:seed`    | Seed des données de démonstration |
