import { FastifyInstance } from "fastify"
import { ZodError } from "zod/v4"
import { ClientError } from "./http/_errors/client-error.ts"
import { UnauthorizedError } from "./http/_errors/unauthorized-error.ts"

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Invalid input',
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof ClientError) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({
      message: error.message,
    })
  }

  return reply.status(500).send({ message: 'Internal server error', error })
}