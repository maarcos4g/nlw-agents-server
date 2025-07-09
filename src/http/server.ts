import fastify from "fastify";
import { fastifyCors } from "@fastify/cors";
import { fastifyMultipart } from "@fastify/multipart";
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
import { uploadAudio } from "./routes/upload-audio.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*'
})

app.register(fastifyMultipart)

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
app.register(uploadAudio)

app.listen({
  port: env.PORT,
})
  .then(() => console.log('🔥 HTTP Server Running...'))