import { randomUUID } from 'crypto'
import { createSupabaseClient } from '../lib/supabaseClient'

interface CreateProductInput {
  name: string
  description: string
  price: number
  stock: number
  userAccessToken: string
}

export async function createProduct({
  name,
  description,
  price,
  stock,
  userAccessToken,
}: CreateProductInput) {
  const supabaseUser = createSupabaseClient(userAccessToken)
  const {
    data: { user },
  } = await supabaseUser.auth.getUser()

  console.log('User logado', user)

  const { data: admin, error } = await supabaseUser
    .from('admins')
    .select('*')
    .eq('id', user?.id)

  if (error) {
    throw error
  }

  console.log('É pra não ter nada', admin)

  if (!admin) {
    throw new Error('Is not admin')
  }
  const { data, error: productError } = await supabaseUser
    .from('products')
    .insert({
      id: randomUUID(),
      name,
      description,
      price,
      stock,
    })
    .select()

  const product = data?.[0]

  if (!product && productError) {
    throw productError
  }
  return {
    name: product.name,
    stock: product.stock,
    price: product.price,
  }
}
