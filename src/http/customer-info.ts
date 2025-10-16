import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/mini'
import { viewCustomerData } from '../services/view-customer-data'

export const cunstomerInfo: FastifyPluginAsyncZod = async app => {
  app.get(
    '/customer',
    {
      schema: {
        tags: ['customer'],
        headers: z.object({
          authorization: z.string(),
        }),
        summary: 'Get customer information',
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

      const customer = await viewCustomerData(String(jwt))

      reply.status(200).send({
        email: customer.email,
        name: customer.name,
        createdAt: customer.createdAt,
      })
    }
  )
}
