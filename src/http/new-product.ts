import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/mini'
import { createProduct } from '../services/create-product'

export const newProduct: FastifyPluginAsyncZod = async app => {
  app.post(
    '/admin/product',
    {
      schema: {
        tags: ['product'],
        headers: z.object({
          authorization: z.string(),
        }),
        summary: 'Insert a new product',
        body: z.object({
          name: z.string(),
          description: z.string(),
          price: z.number(),
          stock: z.int(),
        }),
        response: {
          201: z.object({
            name: z.string(),
            stock: z.int(),
            price: z.number(),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },

    async (request, reply) => {
      const rawJwt = request.headers.authorization
      if (!rawJwt && !rawJwt.match(/^Bearer\s+(.+)$/i)) {
        reply.status(401).send({
          message: 'Unauthorized',
        })
      }
      const { name, description, price, stock } = request.body

      const jwt = rawJwt.replace(/^Bearer\s+/i, '')

      const product = await createProduct({
        name,
        description,
        price,
        stock,
        userAccessToken: jwt,
      })

      reply.status(201).send({
        name: product.name,
        stock: product.stock,
        price: product.price,
      })
    }
  )
}
