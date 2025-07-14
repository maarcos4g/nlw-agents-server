import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { ClientError } from "../_errors/client-error.ts";

export const createUser: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/users',
    {
      schema: {
        body: z.object({
          name: z.string().min(3, { message: 'O nome precisa conter ao menos 3 caracteres.' }),
          email: z.email({ message: 'Insira um e-mail válido.' }),
        })
      }
    },
    async (request, reply) => {
      const { name, email } = request.body

      const existingUser = await db
        .select({
          email: schema.users.email,
        })
        .from(schema.users)
        .where(eq(schema.users.email, email))

      if (!!existingUser[0]) {
        throw new Error('User already exist')
      }

      const result = await db
      .insert(schema.users)
      .values({
        name,
        email
      }).returning()

      const insertedUser = result[0]

      if (!insertedUser) {
        throw new ClientError('Failed to create new user')
      }

      return reply.status(201).send({})
    })
}