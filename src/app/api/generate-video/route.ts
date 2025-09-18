import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import presets from '@/data/presets.json'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { preset, fields, title } = await request.json()

    // Find the preset
    const selectedPreset = presets.find(p => p.id === preset)
    if (!selectedPreset) {
      return NextResponse.json({ message: 'Invalid preset' }, { status: 400 })
    }

    // Check user's plan limits
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { videos: true }
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Check if user has reached their limit
    const videosThisMonth = user.videos.filter(video => {
      const videoDate = new Date(video.createdAt)
      const now = new Date()
      return videoDate.getMonth() === now.getMonth() && 
             videoDate.getFullYear() === now.getFullYear()
    }).length

    if (user.plan === 'free' && videosThisMonth >= 3) {
      return NextResponse.json({ 
        message: 'You have reached your monthly limit of 3 videos. Upgrade to Pro for unlimited videos.' 
      }, { status: 403 })
    }

    // Create video record in database
    const video = await db.video.create({
      data: {
        userId: session.user.id,
        title: title || 'Untitled Video',
        preset: preset,
        url: '', // Will be updated when generation completes
        status: 'processing'
      }
    })

    // Build the prompt for AI video generation
    const prompt = buildVideoPrompt(selectedPreset, fields)

    // Simulate video generation (replace with actual AI video API call)
    const generatedVideoUrl = await simulateVideoGeneration(prompt, selectedPreset)

    // Update video record with generated URL
    await db.video.update({
      where: { id: video.id },
      data: {
        url: generatedVideoUrl,
        status: 'completed'
      }
    })

    return NextResponse.json({
      success: true,
      videoId: video.id,
      videoUrl: generatedVideoUrl,
      message: 'Video generated successfully'
    })

  } catch (error) {
    console.error('Video generation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

function buildVideoPrompt(preset: any, fields: Record<string, string>): string {
  let prompt = `Generate a ${preset.duration} second ${preset.orientation} video.`
  prompt += ` Style: ${preset.style}.`
  prompt += ` Description: ${preset.description}.`
  
  // Add field-specific content
  Object.entries(fields).forEach(([key, value]) => {
    prompt += ` ${key}: ${value}.`
  })

  return prompt
}

async function simulateVideoGeneration(prompt: string, preset: any): Promise<string> {
  // This is a simulation - replace with actual AI video API call
  // For example, with RunwayML, Pika, or other video generation APIs
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Return a placeholder video URL
  // In production, this would be the actual generated video URL
  return `https://example.com/generated-videos/${Date.now()}.mp4`
}
