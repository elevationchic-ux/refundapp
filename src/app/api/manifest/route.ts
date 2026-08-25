import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type Locale = 'fr' | 'en' | 'es' | 'de';

const NAMES: Record<Locale, { name: string; description: string }> = {
  fr: {
    name: 'LitigeFlow – Remboursements & Litiges',
    description: 'Plateforme légale de gestion des remboursements et litiges. Déposez votre dossier en 3 minutes.',
  },
  en: {
    name: 'LitigeFlow – Refund & Dispute Platform',
    description: 'Legal refund and dispute management platform. File your case in 3 minutes.',
  },
  es: {
    name: 'LitigeFlow – Reembolsos y Litigios',
    description: 'Plataforma legal de gestión de reembolsos y litigios. Presenta tu caso en 3 minutos.',
  },
  de: {
    name: 'LitigeFlow – Erstattungen & Streitigkeiten',
    description: 'Legale Plattform für Erstattungs- und Streitverwaltung. Antrag in 3 Minuten stellen.',
  },
};

const SHORTCUTS: Record<Locale, Array<{ name: string; url: string }>> = {
  fr: [
    { name: 'Déposer un dossier', url: '/fr/claim/new' },
    { name: 'Mon espace', url: '/fr/dashboard' },
  ],
  en: [
    { name: 'File a Claim', url: '/en/claim/new' },
    { name: 'My Account', url: '/en/dashboard' },
  ],
  es: [
    { name: 'Presentar reclamación', url: '/es/claim/new' },
    { name: 'Mi cuenta', url: '/es/dashboard' },
  ],
  de: [
    { name: 'Antrag stellen', url: '/de/claim/new' },
    { name: 'Mein Konto', url: '/de/dashboard' },
  ],
};

function detectLocale(req: NextRequest): Locale {
  // Essaie de déduire depuis Accept-Language
  const acceptLang = req.headers.get('accept-language') ?? '';
  const langs = acceptLang.split(',').map((l) => l.split(';')[0].trim().slice(0, 2));
  const supported: Locale[] = ['fr', 'en', 'es', 'de'];
  return supported.find((l) => langs.includes(l)) ?? 'fr';
}

export function GET(req: NextRequest) {
  const locale = detectLocale(req);
  const { name, description } = NAMES[locale];
  const shortcuts = SHORTCUTS[locale];

  const manifest = {
    name,
    short_name: 'LitigeFlow',
    description,
    start_url: `/${locale}`,
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#ffffff',
    theme_color: '#4f46e5',
    categories: ['finance', 'legal', 'utilities'],
    lang: locale,
    dir: 'ltr',
    icons: [
      { src: '/icons/icon-72x72.png',   sizes: '72x72',   type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-96x96.png',   sizes: '96x96',   type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-144x144.png', sizes: '144x144', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
    shortcuts: shortcuts.map((s) => ({
      ...s,
      icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }],
    })),
    prefer_related_applications: false,
    launch_handler: { client_mode: 'navigate-existing' },
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
