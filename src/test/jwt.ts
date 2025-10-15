import { createClient } from '@supabase/supabase-js'
import { env } from '../env'

export async function getJwtForTest(email: string, password: string) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY)
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }
  return data.session?.access_token
}
