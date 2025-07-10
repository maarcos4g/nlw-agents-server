# NLW Agents - Server

Este é o backend do projeto **NLW Agents**, uma API para gerenciamento de salas, perguntas e transcrições de áudio, utilizando Fastify, Drizzle ORM e integração com a API Gemini da Google para transcrição e embeddings.

## Funcionalidades

- Criação e listagem de salas
- Upload de áudios para transcrição automática e geração de embeddings
- Criação de perguntas relacionadas ao contexto dos áudios enviados
- Geração automática de respostas baseadas no contexto das transcrições
- Banco de dados PostgreSQL com suporte a vetores (pgvector)

## Tecnologias

- Node.js + TypeScript
- Fastify
- Drizzle ORM
- PostgreSQL + pgvector
- Google Gemini API

## Estrutura do Projeto

```
src/
  db/
    connection.ts
    seed.ts
    migrations/
    schema/
  http/
    server.ts
    routes/
      create-room.ts
      get-rooms.ts
      upload-audio.ts
      create-question.ts
      get-room-questions.ts
  services/
    gemini.ts
.env.example
docker-compose.yml
```

## Como rodar

1. Instale as dependências:
   ```sh
   pnpm install
   ```

2. Configure o arquivo `.env` baseado no `.env.example`.

3. Suba o banco de dados com Docker:
   ```sh
   docker-compose up -d
   ```

4. Rode as migrações e seeds:
   ```sh
   pnpm run db:push
   pnpm run db:seed
   ```

5. Inicie o servidor:
   ```sh
   pnpm dev
   ```

## Rotas principais

- `POST /rooms` - Cria uma nova sala
- `GET /rooms` - Lista todas as salas
- `POST /rooms/:roomId/audio` - Faz upload de áudio para transcrição
- `POST /rooms/:roomId/questions` - Cria uma pergunta baseada nos áudios da sala
- `GET /rooms/:roomId/questions` - Lista perguntas e respostas da sala

## Licença

MIT