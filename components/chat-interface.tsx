"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, BarChart3 } from "lucide-react"

interface ChatInterfaceProps {
  persona: string
  region: string
  language: string
  onBack: () => void
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function ChatInterface({ persona, region, language, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hello! I'm your M&V Intelligence assistant, configured for ${persona} in ${region}. I'll now connect you to the M&V Expert Advisor ChatGPT bot for personalized assistance. Click the button below to start chatting with the expert system.`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Redirect to ChatGPT bot with context
    const chatUrl = "https://chatgpt.com/g/g-67f5573985648191b7f0579ec68da4ae-m-v-expert-advisor"
    const contextMessage = `I am a ${persona} working in ${region}, and I have this question: ${input}`

    // Open in new tab with context
    window.open(chatUrl, "_blank")

    // Add user message to show what was sent
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content:
        "I've opened the M&V Expert Advisor in a new tab. Please continue your conversation there for the most accurate and up-to-date assistance.",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Selection
            </Button>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold">M&V Intelligence</h1>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {persona} • {region} • {language}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-4 mb-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <Card
                className={`max-w-[80%] ${
                  message.role === "user" ? "bg-blue-600 text-white" : "bg-white border-gray-200"
                }`}
              >
                <CardContent className="p-4">
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-2 ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}

          {messages.length === 1 && (
            <div className="flex justify-center mb-4">
              <Button
                onClick={() =>
                  window.open("https://chatgpt.com/g/g-67f5573985648191b7f0579ec68da4ae-m-v-expert-advisor", "_blank")
                }
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
              >
                Open M&V Expert Advisor ChatGPT →
              </Button>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start">
              <Card className="bg-white border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <p className="text-sm text-gray-600">Thinking...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Input Area */}
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about measurement, verification, or evaluation..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
