import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { createSubscriptionSchema } from '@/lib/validations'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { PRICING, createCheckoutSession, createStripeCustomer } from '@/lib/stripe'

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscriptions = await db.subscription.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error('Fetch subscriptions error:', error)
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rateLimit = checkRateLimit(session.user.id, RATE_LIMITS.API_WRITE)
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const body = await request.json()
    const validated = createSubscriptionSchema.parse(body)

    // Free tier - create directly
    if (validated.tier === 'free') {
      const subscription = await db.subscription.create({
        data: {
          userId: session.user.id,
          tier: 'free',
          status: 'active',
          price: 0,
          period: validated.period,
        },
      })
      return NextResponse.json(subscription, { status: 201 })
    }

    // Paid tier - require Stripe checkout
    if (!validated.stripeSessionId && process.env.STRIPE_SECRET_KEY) {
      // Create Stripe checkout session
      const workspace = await db.workspaceMember.findFirst({
        where: { userId: session.user.id },
        include: { workspace: true },
      })

      if (!workspace) {
        return NextResponse.json({ error: 'No workspace found' }, { status: 400 })
      }

      // Get or create Stripe customer
      let customerId = workspace.workspace.stripeCustomerId
      if (!customerId) {
        const user = await db.user.findUnique({ where: { id: session.user.id } })
        const customer = await createStripeCustomer({
          email: user?.email || '',
          name: user?.name || undefined,
          userId: session.user.id,
        })
        customerId = customer.id
        await db.workspace.update({
          where: { id: workspace.workspace.id },
          data: { stripeCustomerId: customerId },
        })
      }

      const origin = request.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000'
      const checkoutSession = await createCheckoutSession({
        customerId,
        tier: validated.tier,
        period: validated.period,
        userId: session.user.id,
        workspaceId: workspace.workspace.id,
        successUrl: `${origin}/?checkout=success`,
        cancelUrl: `${origin}/?checkout=cancel`,
      })

      return NextResponse.json({ checkoutUrl: checkoutSession.url, sessionId: checkoutSession.id })
    }

    // If stripeSessionId provided (webhook flow), create subscription
    const subscription = await db.subscription.create({
      data: {
        userId: session.user.id,
        tier: validated.tier,
        status: 'active',
        price: PRICING[validated.tier][validated.period],
        period: validated.period,
        stripeSessionId: validated.stripeSessionId,
      },
    })

    return NextResponse.json(subscription, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }
    console.error('Create subscription error:', error)
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
}
