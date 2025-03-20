// File: db/schema.ts

import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

const createdAt = timestamp('created_at', { withTimezone: true })
  .notNull()
  .defaultNow()

const updatedAt = timestamp('updated_at', { withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date())

export const visitors = pgTable(
  'visitors',
  {
    sessionId: uuid('session_id').primaryKey(), // Unique identifier for each visitor
    lastActive: timestamp('last_active', { withTimezone: true })
      .notNull()
      .defaultNow(), // Updated with every heartbeat (ping)
    targetDomain: text('target_domain').notNull(), // Identifier for the project/domain this visitor belongs to
    createdAt, // Record creation time
    updatedAt, // Record update time
  },
  (table) => [
    index('visitors_last_active_index').on(table.lastActive),
    index('visitors_target_domain_index').on(table.targetDomain),
  ]
)
