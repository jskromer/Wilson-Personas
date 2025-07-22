"use client"

import { useState } from "react"
import { PersonaSelection } from "@/components/persona-selection"
import { ChatInterface } from "@/components/chat-interface"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"

interface ChatSession {
  persona: string
  region: string
  language: string
}

export default function Page() {
  const [chatSession, setChatSession] = useState<ChatSession | null>(null)
  const [showAnalytics, setShowAnalytics] = useState(false)

  const handleStartChat = (persona: string, region: string, language: string) => {
    setChatSession({ persona, region, language })
  }

  const handleBackToSelection = () => {
    setChatSession(null)
  }

  const handleShowAnalytics = () => {
    setShowAnalytics(true)
  }

  const handleCloseAnalytics = () => {
    setShowAnalytics(false)
  }

  if (showAnalytics) {
    return <AnalyticsDashboard onClose={handleCloseAnalytics} />
  }

  if (chatSession) {
    return (
      <ChatInterface
        persona={chatSession.persona}
        region={chatSession.region}
        language={chatSession.language}
        onBack={handleBackToSelection}
      />
    )
  }

  return (
    <PersonaSelection
      onStartChat={handleStartChat}
      selectedRegion="North America"
      selectedLanguage="English"
      onShowAnalytics={handleShowAnalytics}
    />
  )
}