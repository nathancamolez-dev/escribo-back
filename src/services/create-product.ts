import { prisma } from '../lib/prisma'
import { createSupabaseClient } from '../lib/supabaseClient'

interface CreateProductInput {
  name: string
  description: string
  price: number
  stock: number
  userAccessToken: string
}

interface Product {
  name: string
  description: string
  price: number
  stock: number
}

export async function createProduct({
  name,
  description,
  price,
  stock,
  userAccessToken,
}: CreateProductInput) {
  const supabaseUser = createSupabaseClient(userAccessToken)

  const { data: admin, error } = await supabaseUser
    .from('admins')
    .select('*')
    .single()

  if (error) {
    throw error
  }
  if (!admin) {
    throw new Error('Is not admin')
  }
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
    },
  })

  return {
    name: product.name,
    stock: product.stock,
    price: product.price,
  }
}
