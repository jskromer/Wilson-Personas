"use client"

import { useState } from "react"
import { PersonaSelection } from "@/components/persona-selection"
import { ChatInterface } from "@/components/chat-interface"

export default function HomePage() {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState("North America")
  const [selectedLanguage, setSelectedLanguage] = useState("English")

  const handleStartChat = (persona: string, region: string, language: string) => {
    setSelectedPersona(persona)
    setSelectedRegion(region)
    setSelectedLanguage(language)
  }

  const handleBackToSelection = () => {
    setSelectedPersona(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!selectedPersona ? (
        <PersonaSelection
          onStartChat={handleStartChat}
          selectedRegion={selectedRegion}
          selectedLanguage={selectedLanguage}
        />
      ) : (
        <ChatInterface
          persona={selectedPersona}
          region={selectedRegion}
          language={selectedLanguage}
          onBack={handleBackToSelection}
        />
      )}
    </div>
  )
}
