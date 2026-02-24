/**
 * Test fixture for Stripe instance usage patterns
 *
 * Tests detection of Stripe usage via instances (new Stripe(), StripeClient).
 * Should trigger violations where try-catch is missing.
 */

import Stripe from 'stripe';

// Pattern 1: Stripe instance stored in variable
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_example', {
  apiVersion: '2024-12-18.acacia',
});

/**
 * VIOLATION: No try-catch on instance method call
 * Should trigger ERROR violations
 */
export async function createChargeWithInstance(
  amount: number,
  currency: string,
  source: string
) {
  // ❌ No try-catch - should trigger violations
  const charge = await stripeClient.charges.create({
    amount,
    currency,
    source,
  });
  return charge;
}

// Pattern 2: Stripe instance in class
class PaymentService {
  private stripe: Stripe;

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2024-12-18.acacia',
    });
  }

  /**
   * VIOLATION: No error handling on instance method
   * Should trigger ERROR violations
   */
  async createPayment(amount: number, currency: string, source: string) {
    // ❌ No try-catch - should trigger violations
    const charge = await this.stripe.charges.create({
      amount,
      currency,
      source,
    });
    return charge;
  }

  /**
   * CORRECT: Proper error handling on instance method
   * Should NOT trigger ERROR violations
   */
  async createPaymentSafe(amount: number, currency: string, source: string, idempotencyKey: string) {
    try {
      const charge = await this.stripe.charges.create(
        {
          amount,
          currency,
          source,
        },
        {
          idempotencyKey,
        }
      );
      return charge;
    } catch (error) {
      if (error instanceof Stripe.errors.StripeCardError) {
        console.error('Card declined:', error.message);
        throw new Error('Payment declined');
      } else if (error instanceof Stripe.errors.StripeRateLimitError) {
        console.error('Rate limited');
        throw new Error('Rate limit exceeded');
      } else {
        console.error('Payment error:', error);
        throw error;
      }
    }
  }

  /**
   * VIOLATION: Multiple instance calls without error handling
   * Should trigger multiple ERROR violations
   */
  async processFullPaymentWorkflow(
    customerEmail: string,
    amount: number,
    currency: string,
    source: string
  ) {
    // ❌ Multiple calls without try-catch
    const customer = await this.stripe.customers.create({
      email: customerEmail,
    });

    const charge = await this.stripe.charges.create({
      amount,
      currency,
      source,
      customer: customer.id,
    });

    return { customer, charge };
  }
}

// Pattern 3: Constructor injection
class BillingService {
  constructor(private stripeClient: Stripe) {}

  /**
   * VIOLATION: No error handling with injected instance
   * Should trigger ERROR violations
   */
  async createInvoice(customerId: string, amount: number) {
    // ❌ No try-catch - should trigger violations
    const paymentIntent = await this.stripeClient.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: customerId,
    });
    return paymentIntent;
  }

  /**
   * CORRECT: Proper error handling with injected instance
   * Should NOT trigger ERROR violations
   */
  async createInvoiceSafe(customerId: string, amount: number, idempotencyKey: string) {
    try {
      const paymentIntent = await this.stripeClient.paymentIntents.create(
        {
          amount,
          currency: 'usd',
          customer: customerId,
        },
        {
          idempotencyKey,
        }
      );
      return paymentIntent;
    } catch (error) {
      if (error instanceof Stripe.errors.StripeRateLimitError) {
        console.error('Rate limited');
        throw new Error('Rate limit exceeded');
      } else if (error instanceof Stripe.errors.StripeInvalidRequestError) {
        console.error('Invalid request:', error.message);
        throw new Error('Invalid invoice data');
      } else {
        console.error('Invoice creation error:', error);
        throw error;
      }
    }
  }
}

// Pattern 4: Function returning instance
function createStripeClient(apiKey: string): Stripe {
  return new Stripe(apiKey, {
    apiVersion: '2024-12-18.acacia',
  });
}

/**
 * VIOLATION: Using function-created instance without error handling
 * Should trigger ERROR violations
 */
export async function chargeWithFunctionClient(
  apiKey: string,
  amount: number,
  currency: string,
  source: string
) {
  const stripe = createStripeClient(apiKey);

  // ❌ No try-catch - should trigger violations
  const charge = await stripe.charges.create({
    amount,
    currency,
    source,
  });
  return charge;
}

// Pattern 5: Global instance
export const globalStripeClient = new Stripe(
  process.env.STRIPE_SECRET_KEY || 'sk_test_example',
  {
    apiVersion: '2024-12-18.acacia',
  }
);

/**
 * VIOLATION: Using global instance without error handling
 * Should trigger ERROR violations
 */
export async function createCustomerWithGlobalClient(email: string) {
  // ❌ No try-catch - should trigger violations
  const customer = await globalStripeClient.customers.create({
    email,
  });
  return customer;
}

/**
 * CORRECT: Using global instance with proper error handling
 * Should NOT trigger ERROR violations
 */
export async function createCustomerWithGlobalClientSafe(
  email: string,
  idempotencyKey: string
) {
  try {
    const customer = await globalStripeClient.customers.create(
      {
        email,
      },
      {
        idempotencyKey,
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

// Pattern 6: Instance with different configurations
class MultiTenantPaymentService {
  private testStripe: Stripe;
  private liveStripe: Stripe;

  constructor(testKey: string, liveKey: string) {
    this.testStripe = new Stripe(testKey, {
      apiVersion: '2024-12-18.acacia',
    });
    this.liveStripe = new Stripe(liveKey, {
      apiVersion: '2024-12-18.acacia',
    });
  }

  /**
   * VIOLATION: No error handling on either instance
   * Should trigger ERROR violations
   */
  async createTestCharge(amount: number, currency: string, source: string) {
    // ❌ No try-catch - should trigger violations
    const charge = await this.testStripe.charges.create({
      amount,
      currency,
      source,
    });
    return charge;
  }

  /**
   * VIOLATION: No error handling on live instance
   * Should trigger ERROR violations
   */
  async createLiveCharge(amount: number, currency: string, source: string) {
    // ❌ No try-catch - should trigger violations
    const charge = await this.liveStripe.charges.create({
      amount,
      currency,
      source,
    });
    return charge;
  }
}
