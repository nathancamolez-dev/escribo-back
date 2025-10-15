import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { createCustomer } from '../services/create-customer'
import { getJwtForTest } from '../test/jwt'

export const newCustomer: FastifyPluginAsyncZod = async app => {
  app.post(
    '/customer',
    {
      schema: {
        tags: ['customer'],
        summary: 'Create a new customer',
        body: z.object({
          email: z.email(),
          name: z.string(),
          password: z.string(),
        }),
        response: {
          201: z.object({
            email: z.email(),
            name: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, name, password } = request.body
      const customer = await createCustomer({ email, name, password })

      console.log(await getJwtForTest(email, password))

      reply.status(201).send({
        email: customer.email,
        name: customer.name,
      })
    }
  )
}
