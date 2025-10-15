import z from 'zod/v3'

const schemaEnv = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  APP_URL: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_KEY: z.string(),
  SUPABASE_SERVICE_KEY: z.string(),
})

export const env = schemaEnv.parse(process.env)
