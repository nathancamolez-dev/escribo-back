import { randomUUID } from 'crypto'
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

  const { data, error: orderError } = await supabaseUser
    .from('orders')
    .insert({
      id: randomUUID(),
      customerId: user.id,
      total: 0,
      status: 'pending',
    })
    .select()

  if (!data && orderError) {
    throw error
  }
  const order = data[0]
  const orderId = data[0].id
  console.log(existingIds)
  console.log(orderId)

  const { data: orderItems, error: orderItemError } = await supabaseUser
    .from('OrderItem')
    .insert(
      productIds.map(p => ({
        id: randomUUID(),
        orderId: orderId,
        productId: p.productId,
        quantity: p.quantity,
        price: 0,
      }))
    )
  if (orderItemError) {
    throw orderItemError
  }

  return {
    order,
    orderItems,
  }
}
