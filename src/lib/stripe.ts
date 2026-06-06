import Stripe from 'stripe'

// Initialize Stripe only when needed
let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-04-22.dahlia',
      typescript: true,
    })
  }
  return stripeInstance
}

// ── Pricing Configuration ──
export const PRICING = {
  free: {
    name: 'Free',
    monthly: 0,
    yearly: 0,
    features: [
      '1 workspace (personal only)',
      'Up to 3 members',
      'Basic AI suggestions (10/day)',
      '7-day trial of Professional features',
    ],
    limits: {
      workspaces: 1,
      members: 3,
      aiCallsPerDay: 10,
      vaultDocuments: 50,
      memories: 100,
    },
  },
  professional: {
    name: 'Professional',
    monthly: 19,
    yearly: 190, // ~$15.83/month (17% savings)
    priceIds: {
      monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || '',
      yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || '',
    },
    features: [
      'Unlimited workspaces (personal + family)',
      'Up to 10 members per workspace',
      'Full AI analysis & suggestions',
      '4-level autonomous system',
      'Knowledge Vault with AI intelligence',
      'Priority support',
    ],
    limits: {
      workspaces: 5,
      members: 10,
      aiCallsPerDay: 100,
      vaultDocuments: 500,
      memories: 1000,
    },
  },
  business: {
    name: 'Business',
    monthly: 49,
    yearly: 490, // ~$40.83/month (17% savings)
    priceIds: {
      monthly: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID || '',
      yearly: process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID || '',
    },
    features: [
      'Unlimited workspaces (personal + family + company)',
      'Unlimited members',
      'Full AI with executive agent',
      'Full autonomous mode (level 3)',
      'Advanced financial audit',
      'API access',
      'Dedicated support',
    ],
    limits: {
      workspaces: -1, // unlimited
      members: -1,
      aiCallsPerDay: -1,
      vaultDocuments: -1,
      memories: -1,
    },
  },
} as const

export type TierKey = keyof typeof PRICING

// ── Stripe Helpers ──

export async function createCheckoutSession(params: {
  customerId: string
  tier: TierKey
  period: 'monthly' | 'yearly'
  userId: string
  workspaceId: string
  successUrl: string
  cancelUrl: string
}): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe()

  if (params.tier === 'free') {
    throw new Error('Cannot create checkout session for free tier')
  }

  const tierConfig = PRICING[params.tier] as typeof PRICING.professional | typeof PRICING.business
  const priceId = tierConfig.priceIds[params.period]
  if (!priceId) {
    throw new Error(`No Stripe price ID configured for ${params.tier}/${params.period}`)
  }

  return stripe.checkout.sessions.create({
    customer: params.customerId,
    mode: 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      userId: params.userId,
      workspaceId: params.workspaceId,
      tier: params.tier,
      period: params.period,
    },
  })
}

export async function createStripeCustomer(params: {
  email: string
  name?: string
  userId: string
}): Promise<Stripe.Customer> {
  const stripe = getStripe()
  return stripe.customers.create({
    email: params.email,
    name: params.name || undefined,
    metadata: {
      userId: params.userId,
    },
  })
}

export async function handleWebhookEvent(
  body: string,
  signature: string
): Promise<Stripe.Event> {
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured')
  }
  return stripe.webhooks.constructEvent(body, signature, webhookSecret)
}

export async function cancelSubscription(stripeSubId: string): Promise<Stripe.Subscription> {
  const stripe = getStripe()
  return stripe.subscriptions.update(stripeSubId, {
    cancel_at_period_end: true,
  })
}

export async function getSubscription(stripeSubId: string): Promise<Stripe.Subscription> {
  const stripe = getStripe()
  return stripe.subscriptions.retrieve(stripeSubId)
}
