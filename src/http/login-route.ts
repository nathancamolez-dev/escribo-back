import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/mini'
import { login } from '../services/login'

export const loginRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/login',
    {
      schema: {
        tags: ['user'],
        summary: 'Login user for test porpouses',
        body: z.object({
          email: z.string(),
          password: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const jwt = await login({ email, password })

      reply.status(200).send({
        jwt,
      })
    }
  )
}
