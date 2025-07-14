import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import { eq } from "drizzle-orm";
import { auth } from "../middlewares/auth.ts";
import { ClientError } from "../_errors/client-error.ts";

export const getProfile: FastifyPluginCallbackZod = (app) => {
  app
    .register(auth)
    .get(
      '/profile',
      async (request, reply) => {
        const currentUserId = await request.getCurrentUserId()

        const result = await db
          .select({
            id: schema.users.id,
            email: schema.users.email,
            name: schema.users.name,
            createdAt: schema.users.createdAt,
          })
          .from(schema.users)
          .where(eq(schema.users.id, currentUserId))

        const user = result[0]

        if (!user) {
          throw new ClientError('Error while getting user')
        }

        return reply.send({ user })
      })
}