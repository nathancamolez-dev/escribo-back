import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { exportOrderCsv } from './http/csv-export'
import { cunstomerInfo } from './http/customer-info'
import { loginRoute } from './http/login-route'
import { newCustomer } from './http/new-customer'
import { newOrder } from './http/new-order'
import { newProduct } from './http/new-product'
import { getOrderDetailById } from './http/order-details'

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Escribo API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(loginRoute)
app.register(newCustomer)
app.register(cunstomerInfo)
app.register(newProduct)
app.register(newOrder)
app.register(exportOrderCsv)
app.register(getOrderDetailById)

app
  .listen({ port: 3333 })
  .then(() => console.log('Server running on port 3333'))
