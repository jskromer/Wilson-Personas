
"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, Users, MessageSquare, TrendingUp, Clock } from 'lucide-react'

interface AnalyticsData {
  stats: {
    total_sessions: number
    total_messages: number
    avg_messages_per_session: number
    unique_personas: number
    unique_regions: number
  }
  analytics: Array<{
    date: string
    total_sessions: number
    total_messages: number
    avg_messages_per_session: number
    top_persona: string
    top_region: string
  }>
  queries: Array<{
    content: string
    frequency: number
    avg_response_time: number
  }>
}

interface AnalyticsDashboardProps {
  onClose: () => void
}

export function AnalyticsDashboard({ onClose }: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState(7)

  useEffect(() => {
    fetchAnalytics()
  }, [selectedPeriod])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const [overviewRes, queriesRes] = await Promise.all([
        fetch(`/api/analytics?type=overview&days=${selectedPeriod}`),
        fetch('/api/analytics?type=popular-queries&limit=10')
      ])

      if (overviewRes.ok && queriesRes.ok) {
        const overview = await overviewRes.json()
        const queries = await queriesRes.json()

        setData({
          stats: overview.stats,
          analytics: overview.analytics,
          queries: queries.queries
        })
      } else {
        // Fallback to mock data if database is unavailable
        setData(getMockAnalyticsData())
      }
    } catch (error) {
      console.error('Failed to fetch analytics, using mock data:', error)
      // Use mock data as fallback
      setData(getMockAnalyticsData())
    } finally {
      setLoading(false)
    }
  }

  const getMockAnalyticsData = () => ({
    stats: {
      total_sessions: 847,
      total_messages: 3421,
      avg_messages_per_session: 4.0,
      unique_personas: 6,
      unique_regions: 5
    },
    analytics: [
      {
        date: new Date().toISOString().split('T')[0],
        total_sessions: 45,
        total_messages: 178,
        avg_messages_per_session: 3.96,
        top_persona: 'M&V Specialist',
        top_region: 'North America'
      },
      {
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        total_sessions: 52,
        total_messages: 203,
        avg_messages_per_session: 3.9,
        top_persona: 'Business Analyst',
        top_region: 'Europe'
      },
      {
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        total_sessions: 38,
        total_messages: 156,
        avg_messages_per_session: 4.1,
        top_persona: 'Policy Maker',
        top_region: 'North America'
      },
      {
        date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
        total_sessions: 41,
        total_messages: 167,
        avg_messages_per_session: 4.07,
        top_persona: 'Student',
        top_region: 'Asia Pacific'
      },
      {
        date: new Date(Date.now() - 345600000).toISOString().split('T')[0],
        total_sessions: 33,
        total_messages: 134,
        avg_messages_per_session: 4.06,
        top_persona: 'Consultant',
        top_region: 'Europe'
      },
      {
        date: new Date(Date.now() - 432000000).toISOString().split('T')[0],
        total_sessions: 29,
        total_messages: 118,
        avg_messages_per_session: 4.07,
        top_persona: 'Legal Professional',
        top_region: 'North America'
      },
      {
        date: new Date(Date.now() - 518400000).toISOString().split('T')[0],
        total_sessions: 35,
        total_messages: 142,
        avg_messages_per_session: 4.06,
        top_persona: 'M&V Specialist',
        top_region: 'Latin America'
      }
    ],
    queries: [
      {
        content: "How do I measure the impact of our energy efficiency program?",
        frequency: 23,
        avg_response_time: 850
      },
      {
        content: "What's the difference between measurement and verification?",
        frequency: 19,
        avg_response_time: 720
      },
      {
        content: "Can you help me design a randomized controlled trial?",
        frequency: 17,
        avg_response_time: 950
      },
      {
        content: "How do I calculate baseline energy consumption?",
        frequency: 15,
        avg_response_time: 680
      },
      {
        content: "What are the IPMVP protocols for M&V?",
        frequency: 14,
        avg_response_time: 780
      },
      {
        content: "How do I handle counterfactual analysis in policy evaluation?",
        frequency: 12,
        avg_response_time: 1120
      },
      {
        content: "What statistical methods work best for impact evaluation?",
        frequency: 11,
        avg_response_time: 890
      },
      {
        content: "How do I account for external factors in M&V studies?",
        frequency: 10,
        avg_response_time: 760
      }
    ]
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Wilson Analytics Dashboard</h1>
          </div>
          <Button onClick={onClose} variant="outline">
            Back to Chat
          </Button>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          {[7, 14, 30].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period} days
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.total_sessions || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Total Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.total_messages || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Avg Messages/Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.stats.avg_messages_per_session ? parseFloat(data.stats.avg_messages_per_session.toString()).toFixed(1) : '0'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Personas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.unique_personas || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Regions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.unique_regions || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.analytics.slice(0, 7).map((day) => (
                <div key={day.date} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{new Date(day.date).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-500">
                      {day.top_persona} • {day.top_region}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{day.total_sessions} sessions</div>
                    <div className="text-sm text-gray-500">{day.total_messages} messages</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Queries (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.queries.slice(0, 8).map((query, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-3">
                  <div className="font-medium text-sm mb-1">
                    {query.content.length > 80 ? `${query.content.substring(0, 80)}...` : query.content}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{query.frequency} times</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {query.avg_response_time ? `${Math.round(query.avg_response_time)}ms` : 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Database Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-sm">Using mock analytics data (database not connected)</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This demonstration shows sample analytics data. In a production environment, 
            this would connect to a PostgreSQL database to show real usage statistics.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
