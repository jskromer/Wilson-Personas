import { NextRequest, NextResponse } from 'next/server'

interface ChatRequest {
  message: string
  persona?: string
  region?: string
  language?: string
  context?: string
  sessionId?: string
}

interface ChatResponse {
  response: string
  sessionId: string
  timestamp: string
}

// Helper function to build a context-aware system prompt
function buildSystemPrompt({ role, region, language }: { role: string; region: string; language: string }): string {
  return `You are Wilson, a Measurement and Verification (M&V) Intelligence Assistant.
Your goal is to provide expert M&V guidance and recommendations.
You are interacting with a user who is a ${role}.
The user is located in ${region} and prefers to communicate in ${language}.
Please tailor your responses to be relevant to their role, location, and preferred language.
Be professional, accurate, and helpful.
When providing M&V guidance, ensure it aligns with industry best practices and any relevant regional standards.
If a specific M&V task requires more information, ask clarifying questions.
Do not invent information; if you don't know something, state that clearly.
Your responses should be clear, concise, and actionable.
If the user's request is ambiguous, seek clarification before providing a detailed response.
Ensure all responses are in ${language}.`
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, persona = 'mv-specialist', region = 'north-america', language = 'english', sessionId } = body

    // Build context-aware system prompt
    const systemPrompt = buildSystemPrompt({
      role: persona,
      region: region,
      language: language
    })

    // Generate session ID if not provided
    const currentSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Simple demo response
    const demoResponse = `Thank you for your question: "${message}"

🤖 Wilson M&V Intelligence Assistant
• Persona: ${persona || 'General User'}
• Region: ${region || 'Global'}
• Language: ${language || 'English'}

📋 Demo Mode
This is a demonstration response. In a real implementation, Wilson would:
- Analyze your question in the context of your persona and region
- Provide specific M&V guidance and recommendations  
- Access relevant databases and knowledge systems
- Offer step-by-step implementation guidance
- Utilize the following system prompt: "${systemPrompt}"

Your question would be processed by advanced AI systems to provide contextual, professional-grade measurement and verification assistance.`

    const chatResponse: ChatResponse = {
      response: demoResponse,
      sessionId: currentSessionId,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(chatResponse)
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process chat request',
        timestamp: new Date().toISOString() 
      },
      { status: 500 }
    )
  }
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: 'active',
    service: 'Wilson M&V Intelligence Chat API',
    timestamp: new Date().toISOString()
  })
}