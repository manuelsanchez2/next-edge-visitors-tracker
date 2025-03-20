// File: app/api/ping/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { updateVisitorPing } from '@/drizzle/queries'
import { Redis } from '@upstash/redis'

// Define the runtime as edge
export const runtime = 'edge'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute in milliseconds
const RATE_LIMIT_MAX = 30 // Allow up to 30 ping requests per IP per minute

async function isRateLimited(ip: string): Promise<boolean> {
  const key = `rate_limit_ping:${ip}`

  // Use a pipeline to increment and set the expiration (expire expects seconds)
  const [count, expiry] = (await redis
    .multi()
    .incr(key)
    .expire(key, RATE_LIMIT_WINDOW / 1000)
    .exec()) as [number, number]

  if (count === null || expiry === null) {
    console.error('Error interacting with Upstash')
    return false // or handle the error appropriately
  }

  return count > RATE_LIMIT_MAX
}

/**
 * POST endpoint for sending a heartbeat (ping) for a visitor.
 * Expects a JSON body with a sessionId.
 * Updates the lastActive timestamp for the visitor.
 */
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  if (await isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // Parse the JSON body to retrieve the sessionId
  const body = await request.json()
  const { sessionId } = body
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
  }

  const now = new Date()

  try {
    // Update the lastActive timestamp for the visitor with the provided sessionId
    await updateVisitorPing({ sessionId, now })
    return NextResponse.json({ message: 'Ping updated' })
  } catch (error) {
    console.error('Error updating ping:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
