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

import { buildSystemPrompt } from '@/lib/persona-config'

// Helper function to map display names to config keys
function mapToConfigKey(value: string): string {
  const mapping: { [key: string]: string } = {
    'M&V Specialist': 'mv-specialist',
    'Business Analyst': 'business-analyst',
    'Policy Maker': 'policy-maker',
    'Legal Professional': 'legal-professional',
    'Consultant': 'consultant',
    'Student': 'student',
    'North America': 'north-america',
    'Europe': 'europe',
    'Asia Pacific': 'asia-pacific',
    'Latin America': 'latin-america',
    'Africa': 'africa',
    'English': 'english',
    'Spanish': 'spanish',
    'French': 'french',
    'German': 'german',
    'Japanese': 'japanese',
    'Chinese': 'chinese'
  }
  return mapping[value] || value.toLowerCase().replace(/\s+/g, '-')
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, persona = 'M&V Specialist', region = 'North America', language = 'English', sessionId } = body

    // Map display names to config keys
    const roleKey = mapToConfigKey(persona)
    const regionKey = mapToConfigKey(region)
    const languageKey = mapToConfigKey(language)

    // Build context-aware system prompt using persona config
    const systemPrompt = buildSystemPrompt({
      role: roleKey,
      region: regionKey,
      language: languageKey
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