
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

    // Check if API endpoint is configured and valid
    const apiEndpoint = process.env.CHATBOT_API_ENDPOINT
    let data: any

    if (apiEndpoint && 
        apiEndpoint !== 'YOUR_SHARED_API_ENDPOINT' && 
        apiEndpoint.startsWith('http') && 
        apiEndpoint.length > 10) {
      
      try {
        // Call your shared chatbot API
        const response = await fetch(apiEndpoint, {
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
          const errorText = await response.text()
          console.log(`API endpoint responded with ${response.status}, using fallback`)
          console.log('Request sent:', JSON.stringify({
            url: apiEndpoint,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': process.env.CHATBOT_API_KEY ? 'Bearer [REDACTED]' : 'None',
              'X-Source-Application': source,
            },
            bodyKeys: ['message', 'context', 'sessionId', 'metadata']
          }, null, 2))
          console.log('Error response:', errorText)
          throw new Error(`API request failed: ${response.status}`)
        }

        data = await response.json()
      } catch (error) {
        console.log('API call failed, using fallback response:', error)
        // Fall through to fallback response
        data = {
          response: `Thank you for your question: "${message}"

🤖 M&V Intelligence Assistant
• Persona: ${persona}
• Region: ${region}
• Language: ${language}

⚠️ Demo Mode Active
Your API endpoint returned an error, so this is a demonstration response.

To connect to your actual chatbot:
• Check your CHATBOT_API_ENDPOINT in the Secrets tool
• Ensure your other chatbot accepts POST requests at /api/chat
• Verify the endpoint URL is correct

Context: ${fullContext}`,
          sessionId: currentSessionId
        }
      }
    } else {
      // Fallback response when API is not configured
      data = {
        response: `Thank you for your question: "${message}"

🤖 M&V Intelligence Assistant
• Persona: ${persona}
• Region: ${region}
• Language: ${language}

📋 Demo Mode
This is a demonstration response. To connect to your actual chatbot API:
• Configure CHATBOT_API_ENDPOINT in the Secrets tool
• Add your API key if required
• Test the connection

Context: ${fullContext}`,
        sessionId: currentSessionId
      }
    }

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
