
import { NextRequest, NextResponse } from 'next/server'
import { getUsageAnalytics, getPopularQueries, getSessionStats } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'overview'
    const days = parseInt(searchParams.get('days') || '7')

    switch (type) {
      case 'overview':
        const stats = await getSessionStats()
        const analytics = await getUsageAnalytics(days)
        return NextResponse.json({
          stats,
          analytics,
          period: `${days} days`
        })

      case 'popular-queries':
        const limit = parseInt(searchParams.get('limit') || '10')
        const queries = await getPopularQueries(limit)
        return NextResponse.json({
          queries,
          period: '30 days'
        })

      case 'usage':
        const usage = await getUsageAnalytics(days)
        return NextResponse.json({
          usage,
          period: `${days} days`
        })

      default:
        return NextResponse.json(
          { error: 'Invalid analytics type' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
