
import { NextRequest, NextResponse } from 'next/server'

interface WebhookPayload {
  message: string
  sessionId: string
  source: string
  timestamp: string
  metadata?: any
}

export async function POST(request: NextRequest) {
  try {
    const payload: WebhookPayload = await request.json()
    
    // Verify webhook source (add your verification logic here)
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Log the webhook for debugging
    console.log('Received webhook from external chatbot:', {
      source: payload.source,
      sessionId: payload.sessionId,
      timestamp: payload.timestamp
    })

    // Process the webhook data
    // You can store this in a database, forward to another service, etc.
    
    // Example: Store conversation in memory or database
    // await storeConversation(payload)

    // Send response back to external chatbot
    const response = {
      status: 'received',
      sessionId: payload.sessionId,
      timestamp: new Date().toISOString(),
      acknowledged: true
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// GET endpoint for webhook verification
export async function GET() {
  return NextResponse.json({
    webhook: 'active',
    timestamp: new Date().toISOString()
  })
}
