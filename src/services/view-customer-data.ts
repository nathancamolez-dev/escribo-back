import { createSupabaseClient } from '../lib/supabaseClient'

export async function viewCustomerData(userAccessToken: string) {
  const supabaseUser = createSupabaseClient(userAccessToken)

  const { data, error } = await supabaseUser
    .from('customers')
    .select('*')
    .single()

  if (error) {
    throw new Error(`Error fetching customer data ${error.message}`)
  }

  return data
}
