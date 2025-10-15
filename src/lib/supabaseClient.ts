import { createClient } from '@supabase/supabase-js'
import { env } from '../env'

const supabaseUrl = env.SUPABASE_URL
const supabaseKey = env.SUPABASE_KEY

export function createSupabaseClient(userAccessToken: string) {
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
      },
    },
  })

  return supabase
}
