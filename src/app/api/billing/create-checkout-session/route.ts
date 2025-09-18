import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { priceId } = await request.json()

    // Get user from database
    const user = await db.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?canceled=true`,
      metadata: {
        userId: user.id,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })

  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
