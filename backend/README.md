# ⚙️ Backend - ELLP News

Este diretório contém a API REST do sistema ELLP News.  
Responsável por autenticação, regras de negócio, integração com o banco de dados e controle de usuários e notícias.

Desenvolvido em **Node.js**, com **TypeScript** e **Prisma ORM**, seguindo princípios de modularidade, segurança e validação de dados com **Zod**.

---

## 🎯 Funcionalidades

- Autenticação com JWT e proteção de rotas
- Controle de acesso baseado em papéis (Admin/Publicador)
- CRUD de usuários, categorias e notícias
- Agendamento de publicações e data de expiração automática
- Aprovação e rejeição de notícias
- Sistema de mudanças pendentes para edição
- Contador de visualizações
- API segura com CORS, dotenv e validações com Zod
- Tarefas agendadas com node-cron (ex: limpeza automática)

---

## 🧱 Tecnologias Utilizadas

| Ferramenta    | Versão     | Link                                |
|---------------|------------|-------------------------------------|
| Node.js       | 20.x       | https://nodejs.org                  |
| TypeScript    | 5.x        | https://www.typescriptlang.org      |
| Express       | 5.1.0      | https://expressjs.com               |
| Prisma ORM    | 6.8.2      | https://www.prisma.io               |
| PostgreSQL    | 15.x       | https://www.postgresql.org          |
| Zod           | 3.25.x     | https://github.com/colinhacks/zod   |
| node-cron     | 4.2.0      | https://github.com/node-cron/node-cron |
| Jest          | 29.7.0     | https://jestjs.io                   |
| dotenv        | 16.5.0     | https://github.com/motdotla/dotenv |
| CORS          | 2.8.5      | https://github.com/expressjs/cors   |
| Lodash        | 4.17.21    | https://lodash.com                  |

---

## 📁 Estrutura de Pastas

```
backend/
├── prisma/              # Schema do banco e seeds
├── src/
│   ├── controllers/     # Lógica de rotas
│   ├── routes/          # Definição de rotas Express
│   ├── middlewares/     # JWT, validações e controle de acesso
│   ├── services/        # Lógica de negócio
│   ├── utils/           # Funções auxiliares
│   └── jobs/            # Tarefas agendadas com node-cron
├── .env.example         # Variáveis de ambiente (modelo)
├── package.json
└── README.md
```

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` com base no `.env.example`. Exemplo:

```env
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/ellp_news"
PORT=3000
JWT_SECRET=chave_secreta_segura_com_32+_caracteres
```

---

## 🚀 Como rodar o backend

```bash
# Acesse a pasta do backend
cd backend

# Instale as dependências
npm install

# Rode as migrações e gere o cliente do Prisma
npx prisma migrate dev
npx prisma generate

# Execute em modo de desenvolvimento 
npm run dev

# A API estará disponível em: http://localhost:3000
```

---

## 🧪 Testes

```bash
npm test            # Executa os testes com Jest
npx prisma studio   # Interface visual para o banco
```

---

## 🔐 Autenticação e Papéis

- JWT com middleware de proteção (`isAuthenticated`)
- Papéis:
  - `ADMIN`: acesso total
  - `PUBLISHER`: apenas criação e edição de notícias (com aprovação)

---

## 🛠️ Comandos úteis

```bash
npx prisma migrate dev       # Rodar migrações
npx prisma migrate reset     # Resetar banco
npx prisma migrate deploy    # Produção
npx prisma generate          # Gerar cliente Prisma
npx prisma studio            # Interface visual
npm test                     # Testes unitários
```

---

📅 Última atualização: **Julho/2025**
