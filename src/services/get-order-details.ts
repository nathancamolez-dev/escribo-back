import { createSupabaseClient } from '../lib/supabaseClient'

interface OrderDetailItem {
  item_id: string
  product_id: string
  product_name: string | null
  product_description: string | null
  quantity: number
  unit_price: number
  item_total: number
}

interface OrderDetail {
  order_id: string
  status: string
  total: number
  order_date: string
  customer_name: string | null
  customer_email: string | null
  items: OrderDetailItem[]
}
export async function getOrderDetails(
  orderId: string,
  userAccessToken: string
) {
  const supabaseUser = createSupabaseClient(userAccessToken)

  const { data, error } = await supabaseUser
    .from('order_details')
    .select('*')
    .eq('order_id', orderId)

  if (error) {
    throw new Error(`Error fetching order details: ${error.message}`)
  }

  if (!data || data.length === 0) {
    throw new Error('Order not found')
  }

  const firstRow = data[0]
  const orderDetail: OrderDetail = {
    order_id: firstRow.order_id,
    status: firstRow.status,
    total: firstRow.total,
    order_date: firstRow.order_date,
    customer_name: firstRow.customer_name,
    customer_email: firstRow.customer_email,
    items: data
      .filter((row: any) => row.item_id !== null)
      .map((row: any) => ({
        item_id: row.item_id,
        product_id: row.product_id,
        product_name: row.product_name,
        product_description: row.product_description,
        quantity: row.quantity,
        unit_price: row.unit_price,
        item_total: row.item_total,
      })),
  }

  return orderDetail
}
