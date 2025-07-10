import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './users.ts'

export const otpCode = pgTable('otp_codes', {
  id: uuid().primaryKey().defaultRandom(),
  code: text().notNull(),
  userId: uuid().references(() => users.id),
  createdAt: timestamp().defaultNow().notNull(),
  expiredAt: timestamp().notNull()
})
