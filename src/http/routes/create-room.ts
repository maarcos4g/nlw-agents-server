import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import { z } from "zod/v4";
import { auth } from "../middlewares/auth.ts";
import { generateRoomCode } from "../../utils/generate-room-code.ts";

export const createRoom: FastifyPluginCallbackZod = (app) => {
  app
    .register(auth)
    .post(
      '/rooms',
      {
        schema: {
          body: z.object({
            name: z.string().min(1),
            description: z.string().optional(),
          })
        }
      },
      async (request, reply) => {

        const currentUserId = await request.getCurrentUserId()

        const { name, description } = request.body

        const code = generateRoomCode()

        const result = await db.insert(schema.rooms).values({
          name,
          description,
          code,
          ownerId: currentUserId,
        }).returning()

        const insertedRoom = result[0]

        if (!insertedRoom) {
          throw new Error('Failed to create new room')
        }

        return reply.status(201).send({
          roomId: insertedRoom.id
        })
      })
}