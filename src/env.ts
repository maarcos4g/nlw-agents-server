import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url().startsWith('postgresql://'),
  GEMINI_API_KEY: z.string(),
  BREVO_API_KEY: z.string(),
  FRONTEND_URL: z
  .string()
  .transform((string) => string.split(','))
  .pipe(z.array(z.string().url())),
  JWT_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)