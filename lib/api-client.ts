
interface ChatMessage {
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

class UnifiedChatAPI {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '') // Remove trailing slash
    this.apiKey = apiKey
  }

  async sendMessage(data: ChatMessage): Promise<ChatResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `API request failed: ${response.status}`)
    }

    return response.json()
  }

  async sendWebhook(data: any): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    const response = await fetch(`${this.baseUrl}/api/webhook`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `Webhook failed: ${response.status}`)
    }

    return response.json()
  }

  async getStatus(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`Status check failed: ${response.status}`)
    }

    return response.json()
  }
}

export { UnifiedChatAPI, type ChatMessage, type ChatResponse }
