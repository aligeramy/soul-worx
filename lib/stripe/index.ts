/**
 * Stripe Integration
 * 
 * Handles subscription management for community memberships
 */

import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
})

/**
 * Create a Stripe customer
 */
export async function createStripeCustomer(
  email: string,
  name?: string,
  metadata?: Record<string, string>
) {
  return await stripe.customers.create({
    email,
    name: name || undefined,
    metadata,
  })
}

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
  metadata = {},
}: {
  customerId?: string
  priceId: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    subscription_data: {
      metadata,
    },
  })

  return session
}

/**
 * Create a billing portal session
 */
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId)
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  })
}

/**
 * Immediately cancel a subscription
 */
export async function cancelSubscriptionImmediately(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId)
}

/**
 * Resume a subscription
 */
export async function resumeSubscription(subscriptionId: string) {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  })
}

/**
 * Update subscription (change tier)
 */
export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  
  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'create_prorations',
  })
}

/**
 * Create a subscription product
 */
export async function createProduct({
  name,
  description,
  metadata = {},
}: {
  name: string
  description: string
  metadata?: Record<string, string>
}) {
  return await stripe.products.create({
    name,
    description,
    metadata,
  })
}

/**
 * Create a price for a product
 */
export async function createPrice({
  productId,
  amount,
  currency = 'usd',
  interval = 'month',
  intervalCount = 1,
  metadata = {},
}: {
  productId: string
  amount: number
  currency?: string
  interval?: 'day' | 'week' | 'month' | 'year'
  intervalCount?: number
  metadata?: Record<string, string>
}) {
  return await stripe.prices.create({
    product: productId,
    unit_amount: amount, // in cents
    currency,
    recurring: {
      interval,
      interval_count: intervalCount,
    },
    metadata,
  })
}

/**
 * Get customer by email
 */
export async function getCustomerByEmail(email: string) {
  const customers = await stripe.customers.list({
    email,
    limit: 1,
  })

  return customers.data[0] || null
}

/**
 * Verify webhook signature
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  secret: string
) {
  return stripe.webhooks.constructEvent(payload, signature, secret)
}

