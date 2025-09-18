import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    const whereClause: any = {
      userId: session.user.id
    }

    if (status && status !== 'all') {
      whereClause.status = status
    }

    const videos = await db.video.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        url: true,
        thumbnail: true,
        status: true,
        createdAt: true,
        preset: true,
        updatedAt: true
      }
    })

    const totalVideos = await db.video.count({
      where: whereClause
    })

    return NextResponse.json({
      videos,
      pagination: {
        page,
        limit,
        total: totalVideos,
        pages: Math.ceil(totalVideos / limit)
      }
    })

  } catch (error) {
    console.error('Get videos error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
