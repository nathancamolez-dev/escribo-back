import { prisma } from '../lib/prisma'
import { createSupabaseClient } from '../lib/supabaseClient'

type ProductIds = Array<{
  productId: string
  quantity: number
}>

interface OrderProductInput {
  productIds: ProductIds
  userAccessToken: string
}

export async function orderProduct({
  productIds,
  userAccessToken,
}: OrderProductInput) {
  const supabaseUser = createSupabaseClient(userAccessToken)
  const { data: user, error } = await supabaseUser
    .from('customers')
    .select('*')
    .single()

  console.log(user)

  if (error) {
    throw error
  }

  const ids = productIds.map(p => p.productId)

  const existingProducts = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  })

  const existingIds = new Set(existingProducts.map(p => p.id))
  const missingIds = ids.filter(id => !existingIds.has(id))

  if (missingIds.length > 0) {
    throw new Error(`Product(s) ${missingIds} not found on the database`)
  }
}
