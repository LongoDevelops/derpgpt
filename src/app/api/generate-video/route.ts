import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import presets from '@/data/presets.json'
import RunwayML, { TaskFailedError } from '@runwayml/sdk'

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
    const videosThisMonth = user.videos.filter((video: any) => {
      const videoDate = new Date(video.createdAt)
      const now = new Date()
      return videoDate.getMonth() === now.getMonth() && 
             videoDate.getFullYear() === now.getFullYear()
    }).length

    if (user.plan === 'free' && videosThisMonth >= 100) {
      return NextResponse.json({ 
        message: 'You have reached your monthly limit of 100 videos. Upgrade to Pro for unlimited videos.' 
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

    // Generate video using RunwayML API
    const generatedVideoUrl = await generateVideoWithRunwayML(prompt, selectedPreset)

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
  let prompt = `Create a professional, high-quality ${preset.orientation} video.`
  
  // Enhanced style descriptions
  const styleEnhancements = {
    'modern, energetic, social media optimized': 'modern, vibrant, cinematic lighting, smooth camera movements, social media ready',
    'polished, feature focused, commercial': 'professional, commercial-grade, high production value, detailed product shots',
    'creative, artistic, brand focused': 'artistic, creative composition, brand-consistent, visually striking',
    'minimalist, clean, product focused': 'minimalist design, clean composition, product-focused, high contrast'
  }
  
  const enhancedStyle = styleEnhancements[preset.style as keyof typeof styleEnhancements] || preset.style
  prompt += ` Style: ${enhancedStyle}.`
  
  // Enhanced description with technical details
  prompt += ` Technical requirements: 8-second duration, ${preset.orientation} format, 4K quality, professional cinematography.`
  prompt += ` Content: ${preset.description}.`
  
  // Add field-specific content with enhancements
  Object.entries(fields).forEach(([key, value]) => {
    if (key === 'Product Name' && value) {
      prompt += ` Focus on showcasing ${value} with dynamic lighting and professional presentation.`
    } else if (key === 'Headline' && value) {
      prompt += ` Include clean, modern typography with "${value}" as the main headline.`
    } else if (key === 'Brand Colors' && value) {
      prompt += ` Use ${value} as the primary color scheme throughout the video.`
    } else if (value) {
      prompt += ` ${key}: ${value}.`
    }
  })

  // Add quality enhancements
  prompt += ` Ensure cinematic quality with smooth transitions, professional lighting, and engaging visual storytelling.`

  return prompt
}

async function generateMockVideo(prompt: string, preset: any): Promise<string> {
  // Simulate video generation time (2-5 seconds)
  const delay = Math.random() * 3000 + 2000
  await new Promise(resolve => setTimeout(resolve, delay))
  
  // Return a mock video URL (you can replace this with a real video URL)
  const mockVideoUrls = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://www.w3schools.com/html/mov_bbb.mp4',
    'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4'
  ]
  
  const randomUrl = mockVideoUrls[Math.floor(Math.random() * mockVideoUrls.length)]
  
  console.log('Mock video generated:', {
    prompt,
    preset: preset.id,
    url: randomUrl
  })
  
  return randomUrl
}

// Use the official RunwayML SDK for video generation
async function generateVideoWithRunwayML(prompt: string, preset: any): Promise<string> {
  const runwayApiKey = process.env.RUNWAY_API_KEY
  
  if (!runwayApiKey) {
    throw new Error('RunwayML API key not configured')
  }

  try {
    // Set the base URL via environment variable for the SDK
    process.env.RUNWAY_BASE_URL = 'https://api.dev.runwayml.com'
    
    // Initialize the RunwayML client
    const client = new RunwayML({
      apiKey: runwayApiKey
    })

        // Generate video using the SDK with enhanced parameters
        const task = await client.textToVideo
          .create({
            model: 'veo3', // Use RunwayML's latest model
            promptText: prompt,
            duration: 8, // veo3 model requires exactly 8 seconds
            ratio: preset.orientation === 'portrait' ? '720:1280' : '1280:720',
            seed: Math.floor(Math.random() * 1000000), // Random seed for variety
          })
          .waitForTaskOutput()

    console.log('RunwayML video generated successfully:', task)
    
    // Extract the video URL from the response
    let videoUrl = ''
    if (task.output && Array.isArray(task.output) && task.output.length > 0) {
      videoUrl = task.output[0] // Get the first URL from the array
    } else {
      videoUrl = (task as any).output_url || (task as any).video_url || (task as any).url || (task as any).output
    }
    
    return videoUrl
    
  } catch (error) {
    if (error instanceof TaskFailedError) {
      console.error('RunwayML task failed:', error.taskDetails)
      throw new Error(`Video generation failed: ${error.message}`)
    } else {
      console.error('RunwayML video generation error:', error)
      throw error
    }
  }
}
