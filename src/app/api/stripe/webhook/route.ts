import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  return new Stripe(key);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') ?? '';

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? '');
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle events  extend once Prisma migration with `plan` field is applied
  switch (event.type) {
    case 'checkout.session.completed':
      console.log('Payment completed:', (event.data.object as Stripe.Checkout.Session).customer_details?.email);
      break;
    case 'customer.subscription.deleted':
      console.log('Subscription cancelled');
      break;
  }

  return NextResponse.json({ received: true });
}
