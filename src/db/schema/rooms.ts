import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './users.ts'

export const rooms = pgTable('rooms', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  description: text(),
  code: text().unique().notNull(),
  ownerId: uuid().references(() => users.id),
  createdAt: timestamp().defaultNow().notNull()
})
