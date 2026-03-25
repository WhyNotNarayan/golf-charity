import Stripe from 'stripe'

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    // Return a dummy object during build to prevent crashes
    // In production, this will throw if keys are missing
    return new Stripe('dummy_key', { apiVersion: '2026-02-25.clover' })
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-02-25.clover', // Fixed known stable version
    appInfo: {
      name: 'Golf Charity Platform',
    },
  })
}
