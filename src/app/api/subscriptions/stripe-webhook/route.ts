import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { handleWebhookEvent } from '@/lib/stripe'

// Stripe webhooks need raw body - disable body parsing
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
    }

    const event = await handleWebhookEvent(body, signature)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.userId
        const tier = session.metadata?.tier as 'professional' | 'business'
        const period = session.metadata?.period as 'monthly' | 'yearly'

        if (userId && tier && period) {
          // Create or update subscription
          await db.subscription.upsert({
            where: { stripeSessionId: session.id },
            create: {
              userId,
              tier,
              status: 'active',
              price: session.amount_total ? session.amount_total / 100 : 0,
              period,
              stripeSessionId: session.id,
              stripeSubId: session.subscription as string || null,
              startDate: new Date(),
              endDate: new Date(Date.now() + (period === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000),
            },
            update: {
              status: 'active',
              tier,
            },
          })

          // Update workspace subscription tier
          const workspaceId = session.metadata?.workspaceId
          if (workspaceId) {
            await db.workspace.update({
              where: { id: workspaceId },
              data: { subscriptionTier: tier },
            })
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        if (subscription.metadata?.userId) {
          await db.subscription.updateMany({
            where: { stripeSubId: subscription.id },
            data: {
              status: subscription.status === 'active' ? 'active' : 'past_due',
            },
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        await db.subscription.updateMany({
          where: { stripeSubId: subscription.id },
          data: { status: 'cancelled' },
        })

        // Downgrade workspace to free
        const workspaceId = subscription.metadata?.workspaceId
        if (workspaceId) {
          await db.workspace.update({
            where: { id: workspaceId },
            data: { subscriptionTier: 'free' },
          })
        }
        break
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 })
  }
}
