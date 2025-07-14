import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import { z } from "zod/v4";
import { generateAnswer, generateEmbeddings } from "../../services/gemini.ts";
import { and, eq, sql } from "drizzle-orm";
import { auth } from "../middlewares/auth.ts";
import { ClientError } from "../_errors/client-error.ts";

export const createQuestion: FastifyPluginCallbackZod = (app) => {
  app
  .register(auth)
  .post(
    '/rooms/:roomId/questions',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
        body: z.object({
          question: z.string().min(1),
        })
      }
    },
    async (request, reply) => {
      const currentUserId = await request.getCurrentUserId()

      const { question } = request.body
      const { roomId } = request.params

      const embeddings = await generateEmbeddings(question)

      const embeddingsAsString = `[${embeddings.join(',')}]`

      const chunks = await db
        .select({
          id: schema.audioChunks.id,
          transcription: schema.audioChunks.transcription,
          simalarity: sql<number>`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector)`
        })
        .from(schema.audioChunks)
        .where(and(
          eq(schema.audioChunks.roomId, roomId),
          sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector) > 0.7`
        ))
        .orderBy(sql`${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector`)
        .limit(3)

      let answer: string | null = null
      
      if (chunks.length > 0) {
        const transcriptions = chunks.map(chunk => chunk.transcription)
        answer = await generateAnswer(question, transcriptions)
      }

      const result = await db
        .insert(schema.questions)
        .values({
          question,
          roomId,
          answer,
          senderId: currentUserId,
        }).returning()

      const insertedQuestion = result[0]

      if (!insertedQuestion) {
        throw new ClientError('Failed to create new question')
      }

      return reply.status(201).send({
        questionId: insertedQuestion.id,
        answer,
      })
    })
}