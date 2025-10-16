# Escribo API

Este projeto é uma API para gerenciar um e-commerce, permitindo o gerenciamento de clientes, produtos e pedidos.

## Tecnologias

- **Framework:** Fastify
- **Validação:** Zod
- **ORM:** Prisma
- **Banco de dados:** Supabase (PostgreSQL)
- **Documentação da API:** Swagger

## Funcionalidades

- Gerenciamento de clientes (CRUD)
- Gerenciamento de produtos (CRUD)
- Gerenciamento de pedidos (CRUD)
- Autenticação de clientes e administradores
- Exportação de pedidos para CSV

## Pré-requisitos

- Node.js (versão 18 ou superior)
- Conta no Supabase
- Conta no Resend (para envio de emails)

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/escribo-back.git
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto, baseado no arquivo `src/env.ts`.
   - Preencha as variáveis de ambiente com suas credenciais do Supabase e Resend.

4. Configure o banco de dados no Supabase:
   - Crie as tabelas conforme a estrutura definida em `prisma/schema.prisma`.
   - Execute as políticas de RLS (Row-Level Security) documentadas no arquivo `Documentação_teste_tecnico .pdf`.
   - Crie as triggers e views documentadas no mesmo arquivo.

5. Execute as migrações do Prisma:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## Execução

Para iniciar o servidor em modo de desenvolvimento, execute:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3333`.

## Documentação da API

A documentação da API está disponível em `http://localhost:3333/docs` e foi gerada com o Swagger. Através dela, é possível testar todas as rotas da aplicação.

## Rotas da API

### Autenticação

- `POST /login`: Autentica um cliente ou administrador e retorna um token JWT.

### Clientes

- `POST /customer`: Cria um novo cliente.
- `GET /customer`: Retorna as informações do cliente autenticado.

### Produtos

- `POST /admin/product`: Cria um novo produto (requer autenticação de administrador).

### Pedidos

- `POST /order`: Cria um novo pedido.
- `GET /orders/:orderId/details`: Retorna os detalhes de um pedido específico.
- `GET /order/:orderId/export-csv`: Exporta os detalhes de um pedido para um arquivo CSV.
