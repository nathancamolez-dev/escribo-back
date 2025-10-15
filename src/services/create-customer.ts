import { prisma } from '../lib/prisma'
import { supabaseAdmin } from '../lib/supabaseClientAdmin'

interface CreateCustomerInput {
  email: string
  name: string
  password: string
}

export async function createCustomer({
  email,
  name,
  password,
}: CreateCustomerInput) {
  const { data, error: signUpError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
    })

  if (signUpError || !data.user) {
    throw new Error(`Error creating user ${signUpError?.message}`)
  }

  const { user } = data

  const customer = await prisma.customer.create({
    data: {
      id: user.id,
      email,
      name,
    },
  })

  return customer
}
