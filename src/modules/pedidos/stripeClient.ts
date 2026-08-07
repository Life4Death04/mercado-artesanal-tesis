import { loadStripe } from '@stripe/stripe-js'

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripePublishableKey = isPublishableKey(publishableKey) ? publishableKey : null

export const hasStripePublishableKey = stripePublishableKey !== null

export const stripePromise = stripePublishableKey !== null
  ? Promise.resolve()
      .then(() => loadStripe(stripePublishableKey))
      .catch(() => null)
  : null

function isPublishableKey(value: string | undefined): value is string {
  return typeof value === 'string' && /^pk_[A-Za-z0-9_]+$/.test(value)
}
