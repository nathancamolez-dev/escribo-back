import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getOrderDetails } from '../services/get-order-details'

export const getOrderDetailById: FastifyPluginAsyncZod = async app => {
  app.get(
    '/orders/:orderId/details',
    {
      schema: {
        tags: ['order'],
        summary: 'Get details of a specific order',
        headers: z.object({
          authorization: z.string(),
        }),
        params: z.object({
          orderId: z.string().uuid({ message: 'Invalid UUID' }),
        }),
      },
    },
    async (request, reply) => {
      const rawJwt = request.headers.authorization
      if (!rawJwt || !rawJwt.match(/^Bearer\s+(.+)$/i)) {
        return reply.status(401).send({
          message: 'Unauthorized',
        })
      }

      const jwt = rawJwt.replace(/^Bearer\s+/i, '')
      const { orderId } = request.params

      const orderDetails = await getOrderDetails(orderId, jwt)

      reply.status(200).send(orderDetails)
    }
  )
}
