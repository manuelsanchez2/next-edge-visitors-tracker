// File: app/api/activeVisitors/route.ts

import { NextResponse } from 'next/server'
import { getActiveVisitors } from '@/drizzle/queries'

export const runtime = 'edge'

export async function GET() {
  try {
    // Query the number of active visitors whose lastActive is greater than the threshold
    const activeVisitors = await getActiveVisitors()
    return NextResponse.json({ activeVisitors })
  } catch (error) {
    console.error('Error fetching active visitors:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
