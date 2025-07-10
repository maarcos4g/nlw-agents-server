import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { generateOtpCode } from "../../utils/generate-otp-code.ts";
import dayjs from "dayjs";
import { brevo } from "../../services/brevo.ts";
import { render } from "@react-email/render";
import { SendAuthenticationCodeTemplate } from "../../mail/templates/send-authentication-code.tsx";

export const sendAuthenticationCode: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/code',
    {
      schema: {
        body: z.object({
          email: z.email({ message: 'Insira um e-mail válido.' }),
        })
      }
    },
    async (request, reply) => {
      const { email } = request.body

      const existingUser = await db
        .select({
          email: schema.users.email,
          name: schema.users.name,
          id: schema.users.id
        })
        .from(schema.users)
        .where(eq(schema.users.email, email))

      if (!existingUser[0]) {
        throw new Error('User not exist')
      }

      const user = existingUser[0]

      const otp = generateOtpCode()
      const expiredAt = dayjs(new Date()).add(10, 'minutes').toDate()

      const result = await db
        .insert(schema.otpCode)
        .values({
          code: otp,
          expiredAt,
          userId: user.id,
        }).returning()

      const authCode = result[0]

      await brevo.sendTransacEmail({
        subject: '[letmeask] Código de confirmação',
        sender: { name: 'Letmeask', email: 'marcos.dev07@gmail.com' },
        to: [{ email: user.email, name: user.name }],
        htmlContent: await render(SendAuthenticationCodeTemplate({
          code: otp,
          email: user.email
        })),
      })

      return reply.send({ otpId: authCode.id })
    })
}