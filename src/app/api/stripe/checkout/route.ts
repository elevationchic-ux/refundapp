import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.litigeflow.fr';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  return new Stripe(key);
}

const PRICE_IDS: Record<string, string> = {
  premium: process.env.STRIPE_PRICE_PREMIUM ?? '',
};

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const { plan, locale } = await req.json();

    if (!PRICE_IDS[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      success_url: `${siteUrl}/${locale}/dashboard?payment=success`,
      cancel_url: `${siteUrl}/${locale}/pricing?payment=cancelled`,
      locale: locale as Stripe.Checkout.SessionCreateParams.Locale,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return NextResponse.json({ error: 'Stripe session creation failed' }, { status: 500 });
  }
}
