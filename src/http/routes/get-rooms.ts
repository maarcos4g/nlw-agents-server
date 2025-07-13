import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import { count, eq } from "drizzle-orm";
import { auth } from "../middlewares/auth.ts";

export const getRooms: FastifyPluginCallbackZod = (app) => {
  app
  .register(auth)
  .get('/rooms', async (request) => {
    const currentUserId = await request.getCurrentUserId()

    const results = await db
    .select({
      id: schema.rooms.id,
      name: schema.rooms.name,
      createdAt: schema.rooms.createdAt,
      questionsCount: count(schema.questions.id),
      code: schema.rooms.code
    })
    .from(schema.rooms)
    .where(eq(schema.rooms.ownerId, currentUserId))
    .leftJoin(schema.questions, eq(schema.questions.roomId, schema.rooms.id))
    .groupBy(schema.rooms.id, schema.rooms.name)
    .orderBy(schema.rooms.createdAt)

    return results
  })
}