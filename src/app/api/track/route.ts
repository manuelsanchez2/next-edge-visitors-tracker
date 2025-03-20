// File: app/api/track/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { insertVisitor } from '@/drizzle/queries'
import { Redis } from '@upstash/redis'

// Define the runtime as edge
export const runtime = 'edge'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

// In‑memory rate limiter (for demonstration only)
// For production, use a distributed solution (e.g., Redis)
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 10

async function isRateLimited(ip: string): Promise<boolean> {
  const key = `rate_limit:${ip}`

  const [count, expiry] = (await redis
    .multi()
    .incr(key)
    .expire(key, RATE_LIMIT_WINDOW / 1000)
    .exec()) as [number, number] // Assert the correct return type

  if (count === null || expiry === null) {
    console.error('Error interacting with Upstash')
    return false // Or handle the error as appropriate
  }

  return count > RATE_LIMIT_MAX
}

/**
 * POST endpoint for tracking a new visitor.
 * Generates a session ID, inserts a visitor record in the DB, and returns the session ID.
 */
export async function POST(request: NextRequest) {
  // Retrieve the client IP address from headers
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  if (await isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // Optional: Extract targetDomain from query params or headers if needed.
  // For example, here we try to get it from the "referer" header.
  const targetDomain = request.headers.get('referer') || 'default-domain'

  // Generate a new unique sessionId
  const sessionId = crypto.randomUUID()
  const now = new Date()

  try {
    // Create a new drizzle instance using your Neon DB configuration.
    // Replace the placeholder with your actual connection config.

    // Insert the new visitor record into the visitors table.
    await insertVisitor({ sessionId, targetDomain, now })

    return NextResponse.json({ sessionId })
  } catch (error) {
    console.error('Error tracking visitor:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
