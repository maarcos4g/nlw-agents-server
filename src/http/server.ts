import fastify from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider
} from 'fastify-type-provider-zod'
import { env } from "../env.ts";
import { getRooms } from "./routes/get-rooms.ts";
import { createRoom } from "./routes/create-room.ts";
import { getRoomQuestions } from "./routes/get-room-questions.ts";
import { createQuestion } from "./routes/create-question.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*'
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.get('/health', async () => {
  return 'Ok'
})

//routes
app.register(getRooms)
app.register(createRoom)
app.register(getRoomQuestions)
app.register(createQuestion)

app.listen({
  port: env.PORT,
})
  .then(() => console.log('🔥 HTTP Server Running...'))