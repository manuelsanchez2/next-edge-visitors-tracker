'use server'

import { db } from '@/drizzle/db'
import { visitors } from '@/drizzle/schema'
import { count, eq, gt, lt } from 'drizzle-orm'

export interface InsertVisitorParams {
  sessionId: string
  targetDomain: string
  now: Date
}

export async function insertVisitor({
  sessionId,
  targetDomain,
  now,
}: InsertVisitorParams) {
  return db.insert(visitors).values({
    sessionId,
    targetDomain,
    lastActive: now,
    createdAt: now,
    updatedAt: now,
  })
}

export interface UpdateVisitorPingParams {
  sessionId: string
  now: Date
}

export async function updateVisitorPing({
  sessionId,
  now,
}: UpdateVisitorPingParams) {
  return db
    .update(visitors)
    .set({ lastActive: now, updatedAt: now })
    .where(eq(visitors.sessionId, sessionId))
}

/**
 * Returns the count of active visitors (active within the last 60 seconds).
 */
export async function getActiveVisitors(): Promise<number> {
  // Define active threshold as 60 seconds ago
  const activeThreshold = new Date(Date.now() - 60 * 1000)

  // Use the count() aggregator to count session IDs
  const result = await db
    .select({ count: count(visitors.sessionId) })
    .from(visitors)
    .where(gt(visitors.lastActive, activeThreshold))

  return result[0]?.count ?? 0
}

/**
 * Deletes visitor records older than a specified threshold.
 */
export async function deleteOldVisitors() {
  // Define the threshold - for example, delete records older than 24 hours
  //   const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000)
  // Define the threshold - for example, delete records older than 1 hour
  // const threshold = new Date(Date.now() - 1 * 60 * 60 * 1000)

  // Define the threshold - for example, delete records older than 5 minutes
  const threshold = new Date(Date.now() - 5 * 60 * 1000)

  const result = await db
    .delete(visitors)
    .where(lt(visitors.lastActive, threshold))

  console.log(`Deleted ${result.rowCount} old visitor records.`)
}
