import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { auth } from "../middlewares/auth.ts";

export const getRoomByCode: FastifyPluginCallbackZod = (app) => {
  app
  .register(auth)
  .get(
    '/rooms/:roomCode',
    {
      schema: {
        params: z.object({
          roomCode: z.string(),
        })
      }
    },
    async (request, reply) => {
      const { roomCode } = request.params

      const results = await db
        .select({
          id: schema.rooms.id,
          name: schema.rooms.name,
          description: schema.rooms.description,
          createdAt: schema.rooms.createdAt,
          code: schema.rooms.code,
          ownerId: schema.rooms.ownerId,
        })
        .from(schema.rooms)
        .where(eq(schema.rooms.code, roomCode))

      const room = results[0]

      return reply.send({ room })
    })
}