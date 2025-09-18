import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        plan: true,
        stripeId: true
      }
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    let subscriptionInfo = null

    if (user.stripeId) {
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: user.stripeId,
          status: 'active',
          limit: 1
        })

        if (subscriptions.data.length > 0) {
          const subscription = subscriptions.data[0]
          subscriptionInfo = {
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
            cancelAtPeriodEnd: subscription.cancel_at_period_end
          }
        }
      } catch (error) {
        console.error('Error fetching subscription:', error)
      }
    }

    return NextResponse.json({
      plan: user.plan,
      stripeId: user.stripeId,
      ...subscriptionInfo
    })

  } catch (error) {
    console.error('Billing info error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
