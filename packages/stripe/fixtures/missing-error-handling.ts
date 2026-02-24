/**
 * Test fixture containing Stripe violations
 *
 * This file demonstrates code that violates behavioral contracts.
 * The analyzer should detect these violations.
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_example', {
  apiVersion: '2024-12-18.acacia',
});

/**
 * VIOLATION: No error handling at all
 * Should trigger ERROR violations
 */
export async function createChargeWithoutErrorHandling(
  amount: number,
  currency: string,
  source: string
) {
  // ❌ No try-catch - should trigger violations
  const charge = await stripe.charges.create({
    amount,
    currency,
    source,
  });
  return charge;
}

/**
 * VIOLATION: Missing idempotency key
 * Should trigger ERROR violation (idempotency-key-required)
 */
export async function createChargeWithoutIdempotency(
  amount: number,
  currency: string,
  source: string
) {
  // ❌ No try-catch - should trigger violations
  // ❌ No idempotency key
  const charge = await stripe.charges.create({
    amount,
    currency,
    source,
  });
  return charge;
}

/**
 * VIOLATION: PaymentIntent without error handling
 * Should trigger ERROR violations
 */
export async function createPaymentIntentWithoutHandling(
  amount: number,
  currency: string
) {
  // ❌ No try-catch - should trigger violations
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    payment_method_types: ['card'],
  });
  return paymentIntent;
}

/**
 * VIOLATION: PaymentIntent confirmation without error handling
 * Should trigger ERROR violations
 */
export async function confirmPaymentIntentWithoutHandling(
  paymentIntentId: string
) {
  // ❌ No try-catch - should trigger violations
  const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

  // ❌ Doesn't check for requires_action status
  return paymentIntent;
}

/**
 * VIOLATION: Refund without error handling
 * Should trigger ERROR violations
 */
export async function createRefundWithoutHandling(
  chargeId: string,
  amount: number
) {
  // ❌ No try-catch - should trigger violations
  const refund = await stripe.refunds.create({
    charge: chargeId,
    amount,
  });
  return refund;
}

/**
 * VIOLATION: Customer creation without error handling
 * Should trigger ERROR violations
 */
export async function createCustomerWithoutHandling(email: string) {
  // ❌ No try-catch - should trigger violations
  const customer = await stripe.customers.create({
    email,
  });
  return customer;
}

/**
 * VIOLATION: Customer retrieval without error handling
 * Should trigger ERROR violations
 */
export async function retrieveCustomerWithoutHandling(customerId: string) {
  // ❌ No try-catch - should trigger violations
  const customer = await stripe.customers.retrieve(customerId);
  return customer;
}

/**
 * VIOLATION: Multiple Stripe calls without error handling
 * Should trigger multiple ERROR violations
 */
export async function processPaymentWorkflowWithoutHandling(
  amount: number,
  currency: string,
  source: string,
  customerId: string
) {
  // ❌ Multiple calls without try-catch
  const customer = await stripe.customers.retrieve(customerId);

  const charge = await stripe.charges.create({
    amount,
    currency,
    source,
    customer: customer.id,
  });

  return charge;
}

/**
 * VIOLATION: Generic catch without proper error type handling
 * Should trigger WARNING violations
 */
export async function createChargeWithGenericCatch(
  amount: number,
  currency: string,
  source: string
) {
  try {
    const charge = await stripe.charges.create({
      amount,
      currency,
      source,
    });
    return charge;
  } catch (error) {
    // ⚠️ Generic catch - doesn't distinguish error types
    console.error('Something went wrong:', error);
    throw error;
  }
}

/**
 * VIOLATION: Catch but doesn't handle rate limit error
 * Should trigger WARNING/ERROR violations
 */
export async function createChargeWithoutRateLimitHandling(
  amount: number,
  currency: string,
  source: string
) {
  try {
    const charge = await stripe.charges.create({
      amount,
      currency,
      source,
    });
    return charge;
  } catch (error) {
    if (error instanceof Stripe.errors.StripeCardError) {
      console.error('Card declined');
      throw error;
    }
    // ⚠️ No rate limit handling - falls through
    throw error;
  }
}

/**
 * VIOLATION: Webhook verification without error handling
 * Should trigger ERROR violations
 */
export function verifyWebhookWithoutHandling(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
) {
  // ❌ No try-catch - signature verification errors will crash
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    webhookSecret
  );
  return event;
}

/**
 * VIOLATION: PaymentIntent without checking requires_action
 * Should trigger WARNING/ERROR violations
 */
export async function confirmPaymentIntentWithoutActionCheck(
  paymentIntentId: string,
  idempotencyKey: string
) {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(
      paymentIntentId,
      { idempotencyKey }
    );

    // ❌ Doesn't check for requires_action status
    // Just assumes success
    return paymentIntent;
  } catch (error) {
    console.error('Confirmation failed:', error);
    throw error;
  }
}
