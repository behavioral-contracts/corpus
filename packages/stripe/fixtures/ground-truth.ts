/**
 * Stripe Ground-Truth Fixture
 *
 * Each call site is annotated // SHOULD_FIRE or // SHOULD_NOT_FIRE.
 * Derived from the stripe contract spec, NOT V1 behavior.
 *
 * Key contract rules:
 *   - stripe.*.create(), .confirm(), .retrieve(), .constructEvent() all have
 *     error-severity postconditions with `throws:` — each requires a try-catch
 *   - Stripe uses property-chain access: stripe.charges.create(), stripe.paymentIntents.create(), etc.
 *   - V2 uses PropertyChainDetector for these deep chains
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2024-12-18.acacia',
});

// ─────────────────────────────────────────────────────────────────────────────
// 1. create — missing try-catch (various resource types)
// ─────────────────────────────────────────────────────────────────────────────

export async function createChargeNoCatch() {
  // SHOULD_FIRE: card-error — stripe.charges.create throws StripeCardError, no try-catch
  const charge = await stripe.charges.create({
    amount: 2000,
    currency: 'usd',
    source: 'tok_visa',
  });
  return charge;
}

export async function createChargeWithCatch() {
  try {
    // SHOULD_NOT_FIRE: create inside try-catch satisfies error handling
    const charge = await stripe.charges.create({
      amount: 2000,
      currency: 'usd',
      source: 'tok_visa',
    });
    return charge;
  } catch (err: any) {
    if (err.type === 'StripeCardError') {
      throw new Error(`Card declined: ${err.decline_code}`);
    }
    throw err;
  }
}

export async function createPaymentIntentNoCatch() {
  // SHOULD_FIRE: card-error — stripe.paymentIntents.create throws StripeCardError, no try-catch
  const pi = await stripe.paymentIntents.create({
    amount: 1999,
    currency: 'usd',
  });
  return pi;
}

export async function createPaymentIntentWithCatch() {
  try {
    // SHOULD_NOT_FIRE: paymentIntents.create inside try-catch is safe
    const pi = await stripe.paymentIntents.create({
      amount: 1999,
      currency: 'usd',
    });
    return pi;
  } catch (err) {
    throw err;
  }
}

export async function createCustomerNoCatch(email: string) {
  // SHOULD_FIRE: card-error — stripe.customers.create throws StripeError, no try-catch
  const customer = await stripe.customers.create({ email });
  return customer;
}

export async function createCustomerWithCatch(email: string) {
  try {
    // SHOULD_NOT_FIRE: customers.create inside try-catch is safe
    const customer = await stripe.customers.create({ email });
    return customer;
  } catch (err) {
    throw err;
  }
}

export async function createSubscriptionNoCatch(customerId: string, priceId: string) {
  // SHOULD_FIRE: card-error — stripe.subscriptions.create throws, no try-catch
  const sub = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
  });
  return sub;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. confirm — missing try-catch
// ─────────────────────────────────────────────────────────────────────────────

export async function confirmPaymentIntentNoCatch(piId: string) {
  // SHOULD_FIRE: card-error — stripe.paymentIntents.confirm throws StripeCardError, no try-catch
  const pi = await stripe.paymentIntents.confirm(piId);
  return pi;
}

export async function confirmPaymentIntentWithCatch(piId: string) {
  try {
    // SHOULD_NOT_FIRE: confirm inside try-catch is safe
    const pi = await stripe.paymentIntents.confirm(piId);
    return pi;
  } catch (err: any) {
    if (err.type === 'StripeCardError') {
      return null; // signal failure
    }
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. constructEvent / webhooks — missing try-catch
// ─────────────────────────────────────────────────────────────────────────────

export function constructEventNoCatch(payload: string, sig: string, secret: string) {
  // SHOULD_FIRE: signature-verification-failed — constructEvent throws on invalid signature, no try-catch
  const event = stripe.webhooks.constructEvent(payload, sig, secret);
  return event;
}

export function constructEventWithCatch(payload: string, sig: string, secret: string) {
  try {
    // SHOULD_NOT_FIRE: constructEvent inside try-catch is safe
    const event = stripe.webhooks.constructEvent(payload, sig, secret);
    return event;
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. retrieve — missing try-catch
// ─────────────────────────────────────────────────────────────────────────────

export async function retrieveChargeNoCatch(chargeId: string) {
  // SHOULD_FIRE: resource-not-found — stripe.charges.retrieve throws on missing resource, no try-catch
  const charge = await stripe.charges.retrieve(chargeId);
  return charge;
}

export async function retrieveChargeWithCatch(chargeId: string) {
  try {
    // SHOULD_NOT_FIRE: retrieve inside try-catch is safe
    const charge = await stripe.charges.retrieve(chargeId);
    return charge;
  } catch (err: any) {
    if (err.code === 'resource_missing') return null;
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Class methods
// ─────────────────────────────────────────────────────────────────────────────

export class StripeService {
  private client: Stripe;

  constructor(key: string) {
    this.client = new Stripe(key, { apiVersion: '2024-12-18.acacia' });
  }

  async createPayment(amount: number) {
    // SHOULD_FIRE: card-error — class method, paymentIntents.create, no try-catch
    const pi = await this.client.paymentIntents.create({ amount, currency: 'usd' });
    return pi;
  }

  async safeCreatePayment(amount: number) {
    try {
      // SHOULD_NOT_FIRE: class method with try-catch is safe
      const pi = await this.client.paymentIntents.create({ amount, currency: 'usd' });
      return pi;
    } catch (err) {
      throw err;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Arrow functions
// ─────────────────────────────────────────────────────────────────────────────

export const createRefundNoCatch = async (chargeId: string) => {
  // SHOULD_FIRE: card-error — arrow function, refunds.create, no try-catch
  const refund = await stripe.refunds.create({ charge: chargeId });
  return refund;
};

export const createRefundWithCatch = async (chargeId: string) => {
  try {
    // SHOULD_NOT_FIRE: arrow function with try-catch is safe
    const refund = await stripe.refunds.create({ charge: chargeId });
    return refund;
  } catch (err) {
    throw err;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. try-finally without catch — SHOULD still fire
// ─────────────────────────────────────────────────────────────────────────────

export async function createWithTryFinallyNoCatch() {
  try {
    // SHOULD_FIRE: card-error — try-finally without catch doesn't catch exceptions
    const pi = await stripe.paymentIntents.create({ amount: 500, currency: 'usd' });
    return pi;
  } finally {
    console.log('Stripe call attempted');
  }
}
