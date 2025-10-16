import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const exportOrderCsv: FastifyPluginAsyncZod = async app => {
  app.get(
    '/order/:orderId/export-csv',
    {
      schema: {
        tags: ['order'],
        summary: 'Export order to CSV',
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

      try {
        // URL da Edge Function do Supabase
        const edgeFunctionUrl = `${process.env.SUPABASE_URL}/functions/v1/csv-export?orderId=${orderId}`

        // Chamar a Edge Function
        const response = await fetch(edgeFunctionUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })

        if (!response.ok) {
          const error = await response.json()
          return reply.status(400).send(error)
        }

        // Obter o CSV como texto
        const csvContent = await response.text()

        // Configurar headers para download
        reply
          .header('Content-Type', 'text/csv; charset=utf-8')
          .header(
            'Content-Disposition',
            `attachment; filename="pedido_${orderId}.csv"`
          )
          .send(csvContent)
      } catch (error) {
        reply.status(500).send({
          message: 'Error exporting order to CSV',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )
}
