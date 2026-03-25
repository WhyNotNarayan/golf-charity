import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover', // Fixed known stable version
  appInfo: {
    name: 'Golf Charity Platform',
  },
})
