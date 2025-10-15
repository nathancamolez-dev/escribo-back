import { createClient } from '@supabase/supabase-js'
import { env } from '../env'

const supabaseUrl = env.SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_KEY

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
