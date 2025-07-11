import fastify from "fastify";
import { fastifyCors } from "@fastify/cors";
import { fastifyJwt } from "@fastify/jwt";
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
import { createUser } from "./routes/create-user.ts";
import { sendAuthenticationCode } from "./routes/send-authentication-code.ts";
import { validateAuthenticationCode } from "./routes/validate-code.ts";
import { getProfile } from "./routes/get-profile.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PATCH', 'DELETE']
})

app.register(fastifyMultipart)
app.register(fastifyJwt, {
  secret: 'uifeuygugwhwquihui7y8y814yy8uhu'
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
app.register(uploadAudio)
app.register(createUser)
app.register(sendAuthenticationCode)
app.register(validateAuthenticationCode)
app.register(getProfile)

app.listen({
  port: env.PORT,
  host: '0.0.0.0'
})
  .then(() => console.log('🔥 HTTP Server Running...'))