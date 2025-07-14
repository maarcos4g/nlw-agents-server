import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";
import { UnauthorizedError } from "../_errors/unauthorized-error.ts";
import { ClientError } from "../_errors/client-error.ts";

export const validateAuthenticationCode: FastifyPluginCallbackZod = (app) => {
  app.patch(
    '/code',
    {
      schema: {
        body: z.object({
          code: z.string().max(6, { message: 'O código enviado tem apenas 6 caracteres' }),
        })
      }
    },
    async (request, reply) => {
      const { code } = request.body

      const authCodeExist = await db
        .select({
          id: schema.otpCode.id,
          code: schema.otpCode.code,
          expiredAt: schema.otpCode.expiredAt,
          userId: schema.otpCode.userId,
        })
        .from(schema.otpCode)
        .where(eq(schema.otpCode.code, code))

      if (!authCodeExist[0]) {
        throw new UnauthorizedError('Invalid code')
      }

      const authCode = authCodeExist[0]

      const diff = dayjs(new Date()).diff(authCode.expiredAt)

      if (diff > 10) {
        throw new ClientError('This code has expired')
      }

      const token = await reply.jwtSign(
        {
          sub: authCode.userId,
        },
        {
          sign: {
            expiresIn: '7d'
          }
        }
      )

      await db
        .delete(schema.otpCode)
        .where(
          eq(schema.otpCode.code, code)
        )

      return reply.send({ token })
    })
}