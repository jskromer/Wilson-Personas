import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildSystemPrompt } from '@/lib/persona-config'

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

export async function POST(req: Request) {
  try {
    console.log('Chat API called')
    const body = await req.json()
    const { message, persona, region, language, sessionId } = body

    console.log('Request:', { message, persona, region, language })

    if (!message || !persona || !region || !language) {
      console.error('Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not configured')
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured. Please add it in the Secrets tool.' },
        { status: 500 }
      )
    }
    console.log('Chat API: API key found')

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

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: apiKey,
    })

    // Call Claude API with Claude Opus 4.5 (latest, most capable model)
    console.log('Chat API: Calling Claude API with message:', message.substring(0, 50) + '...')
    const claudeResponse = await anthropic.messages.create({
      model: 'claude-opus-4-20250514', // Claude Opus 4.5 - latest flagship model
      max_tokens: 8192, // Increased for more comprehensive M&V responses
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    })

    console.log('Chat API: Received response from Claude')

    // Extract the text response
    const responseText = claudeResponse.content[0].type === 'text' 
      ? claudeResponse.content[0].text 
      : 'Unable to generate response'

    const chatResponse: ChatResponse = {
      response: responseText,
      sessionId: currentSessionId,
      timestamp: new Date().toISOString()
    }

    console.log('Chat API: Sending response to client')
    return NextResponse.json(chatResponse)
  } catch (error: any) {
    console.error('Chat API error:', error)

    // Handle specific Anthropic errors
    if (error?.status === 401) {
      return NextResponse.json(
        { 
          error: 'Invalid ANTHROPIC_API_KEY. Please check your API key in Secrets.',
          timestamp: new Date().toISOString() 
        },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { 
        error: error?.message || 'Failed to process chat request',
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
    service: 'Wilson M&V Intelligence Chat API (Claude)',
    model: 'claude-opus-4-20250514',
    timestamp: new Date().toISOString()
  })
}