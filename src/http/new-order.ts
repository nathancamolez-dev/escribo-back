import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { orderProduct } from '../services/order-product'

export const newOrder: FastifyPluginAsyncZod = async app => {
  app.post(
    '/order',
    {
      schema: {
        tags: ['order'],
        summary: 'Create new order',
        headers: z.object({
          authorization: z.string(),
        }),
        body: z.object({
          productIds: z.array(
            z.object({
              productId: z.string().uuid({ message: 'Invalid UUID' }),
              quantity: z.number(),
            })
          ),
        }),
      },
    },
    async (request, reply) => {
      const rawJwt = request.headers.authorization
      if (!rawJwt && !rawJwt.match(/^Bearer\s+(.+)$/i)) {
        reply.status(401).send({
          message: 'Unauthorized',
        })
      }

      const jwt = rawJwt.replace(/^Bearer\s+/i, '')
      const { productIds } = request.body

      const { order, orderItems } = await orderProduct({
        productIds,
        userAccessToken: jwt,
      })

      reply.status(201).send({
        message: 'Order created',
        order: {
          order,
          orderItems,
        },
      })
    }
  )
}
