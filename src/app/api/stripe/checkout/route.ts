import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Capture the base URL dynamically
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Create a Stripe Checkout Session with inline product data
    // This removes the need for you to manually create a product in Stripe Dashboard!
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Golf Charity Monthly Subscription',
              description: 'Access to Monthly Draws & Charity Impact',
            },
            unit_amount: 1000, /* 1000 cents = $10.00 */
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/dashboard?canceled=true`,
      subscription_data: {
        metadata: {
          userId: user.id
        }
      }
    })

    // Automatically push the user to the Stripe hosted secure page
    if (session.url) {
       return NextResponse.redirect(session.url, 303)
    }

    return new NextResponse('Error creating Stripe session', { status: 500 })
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
