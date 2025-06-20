"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Scale, Briefcase, GraduationCap, Building } from "lucide-react"

interface PersonaSelectionProps {
  onStartChat: (persona: string, region: string, language: string) => void
  selectedRegion: string
  selectedLanguage: string
}

const personas = [
  {
    id: "mv-specialist",
    name: "M&V Specialist",
    description: "Academic or scientific researcher working with experimental design and causal inference",
    icon: BarChart3,
    tags: ["Statistics", "Economics", "Psychology", "Medicine"],
    color: "border-purple-300 bg-purple-50",
  },
  {
    id: "business-analyst",
    name: "Business Analyst",
    description: "Professional analyzing business impact, ROI, and market interventions",
    icon: TrendingUp,
    tags: ["Marketing", "Finance", "Operations", "Strategy"],
    color: "border-blue-300 bg-blue-50",
  },
  {
    id: "policy-maker",
    name: "Policy Maker",
    description: "Government official or consultant evaluating policy interventions and outcomes",
    icon: Building,
    tags: ["Public Policy", "Economics", "Social Science", "Law"],
    color: "border-green-300 bg-green-50",
  },
  {
    id: "legal-professional",
    name: "Legal Professional",
    description: "Lawyer or legal analyst working with causation, liability, and evidence",
    icon: Scale,
    tags: ["Tort Law", "Evidence", "Forensics", "Litigation"],
    color: "border-amber-300 bg-amber-50",
  },
  {
    id: "consultant",
    name: "Consultant",
    description: "Management or technical consultant measuring intervention effectiveness",
    icon: Briefcase,
    tags: ["Management", "Technology", "Process Improvement", "Change Management"],
    color: "border-gray-300 bg-gray-50",
  },
  {
    id: "student",
    name: "Student",
    description: "Student learning about measurement, verification, and counterfactual reasoning",
    icon: GraduationCap,
    tags: ["Statistics", "Research Methods", "Critical Thinking", "Analysis"],
    color: "border-indigo-300 bg-indigo-50",
  },
]

export function PersonaSelection({ onStartChat, selectedRegion, selectedLanguage }: PersonaSelectionProps) {
  const [selectedPersona, setSelectedPersona] = useState("mv-specialist")
  const [region, setRegion] = useState(selectedRegion)
  const [language, setLanguage] = useState(selectedLanguage)

  const handleStartChat = () => {
    const persona = personas.find((p) => p.id === selectedPersona)
    if (persona) {
      onStartChat(persona.name, region, language)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src="/images/wilson.png" alt="Wilson" className="h-8 w-8" />
          <h1 className="text-3xl font-bold text-gray-900">Wilson's Advice</h1>
        </div>
      </div>

      {/* Language and Region Selection */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Language:</label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="German">German</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Region:</label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="North America">North America</SelectItem>
              <SelectItem value="Europe">Europe</SelectItem>
              <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
              <SelectItem value="Latin America">Latin America</SelectItem>
              <SelectItem value="Africa">Africa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Persona Selection */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
            <span className="text-white text-sm">👤</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Select Your Persona</h2>
        </div>
        <p className="text-gray-600 mb-6">Choose the role that best describes your professional context</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {personas.map((persona) => {
            const Icon = persona.icon
            const isSelected = selectedPersona === persona.id

            return (
              <Card
                key={persona.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? `${persona.color} border-2` : "border border-gray-200"
                }`}
                onClick={() => setSelectedPersona(persona.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Icon className="h-6 w-6 text-gray-700 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{persona.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{persona.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {persona.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Ready to Start Section */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
              <span className="text-white text-sm">💬</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Ready to Start</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language:</label>
              <div className="px-3 py-2 bg-white border border-gray-300 rounded-md">{language}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region:</label>
              <div className="px-3 py-2 bg-white border border-gray-300 rounded-md">{region}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Persona:</label>
              <div className="px-3 py-2 bg-white border border-gray-300 rounded-md">
                {personas.find((p) => p.id === selectedPersona)?.name}
              </div>
            </div>
          </div>

          <Button
            onClick={handleStartChat}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-medium"
          >
            Start M&V Chat Session →
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
