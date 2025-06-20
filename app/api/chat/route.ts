
import { NextRequest, NextResponse } from 'next/server'

interface ChatRequest {
  message: string
  persona?: string
  region?: string
  language?: string
  context?: string
  source?: 'mv-intelligence' | 'other-chatbot'
  sessionId?: string
}

interface ChatResponse {
  response: string
  sessionId: string
  timestamp: string
  source: string
}

export async function POST(request: NextRequest) {
  try {
    const { 
      message, 
      persona, 
      region, 
      language, 
      context, 
      source = 'mv-intelligence',
      sessionId 
    }: ChatRequest = await request.json()

    // Generate session ID if not provided
    const currentSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Build context based on source
    let fullContext = context || ''
    if (source === 'mv-intelligence' && persona && region) {
      fullContext = `I am a ${persona} working in ${region}. Language: ${language}. ${context || ''}`
    }

    // Call your shared chatbot API
    const response = await fetch(process.env.CHATBOT_API_ENDPOINT || 'YOUR_SHARED_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CHATBOT_API_KEY}`,
        'X-Source-Application': source,
      },
      body: JSON.stringify({
        message,
        context: fullContext,
        sessionId: currentSessionId,
        metadata: {
          persona,
          region,
          language,
          source,
          timestamp: new Date().toISOString()
        }
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()

    const chatResponse: ChatResponse = {
      response: data.response || data.message || "I'm here to help!",
      sessionId: currentSessionId,
      timestamp: new Date().toISOString(),
      source
    }

    return NextResponse.json(chatResponse)
  } catch (error) {
    console.error('Unified Chat API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get response from chatbot',
        timestamp: new Date().toISOString() 
      },
      { status: 500 }
    )
  }
}

// GET endpoint for health check and API info
export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoints: {
      chat: '/api/chat',
      webhook: '/api/webhook'
    },
    supportedSources: ['mv-intelligence', 'other-chatbot'],
    timestamp: new Date().toISOString()
  })
}
