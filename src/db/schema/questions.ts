import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { rooms } from './rooms.ts'
import { users } from './users.ts'

export const questions = pgTable('questions', {
  id: uuid().primaryKey().defaultRandom(),
  roomId: uuid().references(() => rooms.id),
  question: text().notNull(),
  answer: text(),
  senderId: uuid().references(() => users.id),
  createdAt: timestamp().defaultNow().notNull()
})
