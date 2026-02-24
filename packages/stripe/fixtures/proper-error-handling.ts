/**
 * Test fixture with CORRECT Stripe usage
 *
 * This file demonstrates code that properly handles all behavioral contracts.
 * The analyzer should produce ZERO ERROR violations for this file.
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_example', {
  apiVersion: '2024-12-18.acacia',
});

/**
 * CORRECT: Proper error handling for charge creation with idempotency
 * Should NOT trigger violations
 */
export async function createChargeWithProperHandling(
  amount: number,
  currency: string,
  source: string,
  idempotencyKey: string
) {
  try {
    const charge = await stripe.charges.create(
      {
        amount,
        currency,
        source,
      },
      {
        idempotencyKey, // ✅ Using idempotency key
      }
    );
    return charge;
  } catch (error) {
    if (error instanceof Stripe.errors.StripeCardError) {
      // ✅ Handle card decline
      console.error('Card was declined:', error.decline_code);
      throw new Error(`Payment declined: ${error.message}`);
    } else if (error instanceof Stripe.errors.StripeRateLimitError) {
      // ✅ Handle rate limit
      console.error('Rate limit exceeded');
      throw new Error('Too many requests - please try again later');
    } else if (error instanceof Stripe.errors.StripeAuthenticationError) {
      // ✅ Handle authentication error
      console.error('Authentication error - invalid API key');
      throw new Error('Payment system configuration error');
    } else if (error instanceof Stripe.errors.StripeAPIError) {
      // ✅ Handle Stripe API errors
      console.error('Stripe API error:', error.message);
      throw error;
    } else {
      // ✅ Handle network errors
      console.error('Network error:', error);
      throw new Error('Network error - please try again');
    }
  }
}

/**
 * CORRECT: PaymentIntent with comprehensive error handling
 * Should NOT trigger violations
 */
export async function createPaymentIntentWithProperHandling(
  amount: number,
  currency: string,
  idempotencyKey: string
) {
  try {
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount,
        currency,
        payment_method_types: ['card'],
      },
      {
        idempotencyKey, // ✅ Using idempotency key
      }
    );
    return paymentIntent;
  } catch (error) {
    if (error instanceof Stripe.errors.StripeCardError) {
      console.error('Card error:', error.message);
      throw new Error('Card payment failed');
    } else if (error instanceof Stripe.errors.StripeRateLimitError) {
      console.error('Rate limit error');
      throw new Error('Rate limited');
    } else if (error instanceof Stripe.errors.StripeAuthenticationError) {
      console.error('Authentication failed');
      throw new Error('Configuration error');
    } else {
      console.error('Payment error:', error);
      throw error;
    }
  }
}

/**
 * CORRECT: PaymentIntent confirmation with error handling
 * Should NOT trigger violations
 */
export async function confirmPaymentIntentWithProperHandling(
  paymentIntentId: string,
  idempotencyKey: string
) {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(
      paymentIntentId,
      {
        idempotencyKey, // ✅ Using idempotency key
      }
    );

    // ✅ Handle requires_action status
    if (paymentIntent.status === 'requires_action') {
      return {
        requiresAction: true,
        clientSecret: paymentIntent.client_secret,
      };
    }

    return { requiresAction: false, paymentIntent };
  } catch (error) {
    if (error instanceof Stripe.errors.StripeCardError) {
      console.error('Card declined during confirmation');
      throw new Error('Payment declined');
    } else if (error instanceof Stripe.errors.StripeRateLimitError) {
      console.error('Rate limited');
      throw new Error('Rate limit exceeded');
    } else {
      console.error('Confirmation error:', error);
      throw error;
    }
  }
}

/**
 * CORRECT: Refund with error handling
 * Should NOT trigger violations
 */
export async function createRefundWithProperHandling(
  chargeId: string,
  amount: number,
  idempotencyKey: string
) {
  try {
    const refund = await stripe.refunds.create(
      {
        charge: chargeId,
        amount,
      },
      {
        idempotencyKey, // ✅ Using idempotency key
      }
    );
    return refund;
  } catch (error) {
    if (
      error instanceof Stripe.errors.StripeInvalidRequestError &&
      error.code === 'charge_already_refunded'
    ) {
      // ✅ Handle already refunded case
      console.error('Charge already refunded');
      throw new Error('This charge has already been refunded');
    } else if (error instanceof Stripe.errors.StripeRateLimitError) {
      console.error('Rate limited');
      throw new Error('Rate limit exceeded');
    } else {
      console.error('Refund error:', error);
      throw error;
    }
  }
}

/**
 * CORRECT: Customer creation with error handling
 * Should NOT trigger violations
 */
export async function createCustomerWithProperHandling(
  email: string,
  idempotencyKey: string
) {
  try {
    const customer = await stripe.customers.create(
      {
        email,
      },
      {
        idempotencyKey, // ✅ Using idempotency key (recommended)
      }
    );
    return customer;
  } catch (error) {
    if (error instanceof Stripe.errors.StripeRateLimitError) {
      console.error('Rate limited');
      throw new Error('Rate limit exceeded');
    } else if (error instanceof Stripe.errors.StripeInvalidRequestError) {
      console.error('Invalid request:', error.message);
      throw new Error('Invalid customer data');
    } else {
      console.error('Customer creation error:', error);
      throw error;
    }
  }
}

/**
 * CORRECT: Customer retrieval with error handling
 * Should NOT trigger violations
 */
export async function retrieveCustomerWithProperHandling(customerId: string) {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer;
  } catch (error) {
    if (
      error instanceof Stripe.errors.StripeInvalidRequestError &&
      error.code === 'resource_missing'
    ) {
      // ✅ Handle missing customer
      console.error('Customer not found');
      return null;
    } else if (error instanceof Stripe.errors.StripeRateLimitError) {
      console.error('Rate limited');
      throw new Error('Rate limit exceeded');
    } else {
      console.error('Customer retrieval error:', error);
      throw error;
    }
  }
}

/**
 * CORRECT: Webhook signature verification with error handling
 * Should NOT trigger violations
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
) {
  try {
    // ✅ Verify signature
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );
    return event;
  } catch (error) {
    if (error instanceof Stripe.errors.StripeSignatureVerificationError) {
      // ✅ Handle signature verification failure
      console.error('Webhook signature verification failed:', error.message);
      throw new Error('Invalid webhook signature');
    } else {
      console.error('Webhook processing error:', error);
      throw error;
    }
  }
}
