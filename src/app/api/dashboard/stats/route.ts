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

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Get user's videos
    const videos = await db.video.findMany({
      where: { userId: session.user.id },
      select: {
        createdAt: true,
        status: true
      }
    })

    // Calculate stats
    const totalVideos = videos.length
    const videosThisMonth = videos.filter(video => 
      video.createdAt >= startOfMonth
    ).length

    // Simulate total minutes (in a real app, you'd store video duration)
    const totalMinutes = videos.length * 1.5 // Assume average 1.5 minutes per video

    // Get most viewed video (simulated)
    const trendingVideo = videos.length > 0 ? {
      id: videos[0].id,
      title: 'Sample Video',
      views: Math.floor(Math.random() * 1000) + 100
    } : undefined

    return NextResponse.json({
      totalVideos,
      videosThisMonth,
      totalMinutes: Math.round(totalMinutes),
      trendingVideo
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
