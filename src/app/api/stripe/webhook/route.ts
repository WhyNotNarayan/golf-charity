import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId
    
    if (userId) {
      // Create subscription record
      await getSupabaseAdmin().from('subscriptions').insert({
        user_id: userId,
        stripe_subscription_id: session.subscription,
        plan_type: 'monthly', // Parse from session logic
        status: 'active'
      })

      // Update user status
      await getSupabaseAdmin().from('users').update({
        subscription_status: 'active',
        stripe_customer_id: session.customer as string
      }).eq('id', userId)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    await getSupabaseAdmin().from('subscriptions').update({
      status: 'canceled'
    }).eq('stripe_subscription_id', subscription.id)
  }

  return new NextResponse(null, { status: 200 })
}
