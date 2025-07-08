import fastify from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider
} from 'fastify-type-provider-zod'
import { sql } from '../db/connection.ts'
import { env } from "../env.ts";
import { getRooms } from "./routes/get-rooms.ts";

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

app.listen({
  port: env.PORT,
})
  .then(() => console.log('🔥 HTTP Server Running...'))