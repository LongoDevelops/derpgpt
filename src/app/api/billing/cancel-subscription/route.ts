import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        stripeId: true
      }
    })

    if (!user?.stripeId) {
      return NextResponse.json({ message: 'No subscription found' }, { status: 404 })
    }

    // Find active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeId,
      status: 'active',
      limit: 1
    })

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ message: 'No active subscription found' }, { status: 404 })
    }

    // Cancel subscription at period end
    const subscription = await stripe.subscriptions.update(
      subscriptions.data[0].id,
      {
        cancel_at_period_end: true
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully',
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    })

  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
