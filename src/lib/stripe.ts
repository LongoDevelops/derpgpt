import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export const STRIPE_CONFIG = {
  free: {
    priceId: null,
    features: [
      '3 free videos',
      'Watermarked videos',
      'Standard quality',
      '30 seconds max'
    ]
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      'Unlimited videos',
      'No watermark',
      'HD quality',
      'Up to 5 minutes',
      'Priority processing'
    ]
  }
}
