# 📰 ELLP News - Sistema de Gerenciamento de Notícias

Sistema web completo desenvolvido como Projeto Final da disciplina **AS65A** da **UTFPR**.  
O projeto simula um **portal de notícias e artigos institucionais**, com foco em segurança, organização editorial, fluxo de aprovação e gestão de conteúdo voltado ao projeto de extensão ELLP News.

---

## 🎯 Objetivo

O objetivo do sistema é permitir a **centralização e padronização da comunicação institucional** por meio de um ambiente intuitivo, seguro e eficiente. O sistema oferece:

- Publicação e agendamento de notícias
- Fluxo de aprovação por papéis (publicador/admin)
- Estatísticas de visualizações
- Interface responsiva para todos os dispositivos

---

## 👥 Equipe

| Nome                      | RA        | Função                |
|---------------------------|-----------|------------------------|
| Diego Kiyoshi Otani       | 2575256   | Backend               |
| Igor Luiz Ribeiro Santos  | 2065894   | Frontend              |
| Italo Pereira Ventura     | 2467259   | Frontend              |
| Victor Gabriel Lucio      | 2575302   | Backend               |
| Weslley Silva             | 2410257   | DevOps / Integração   |

---

## 🔄 Fluxo de Usabilidade

1. **Login**  
   O acesso ao sistema é feito via login com email e senha. Há dois perfis de usuário:
   - **Administrador**: possui controle total sobre o sistema.
   - **Publicador**: pode criar e editar notícias, que ficam pendentes até aprovação.

2. **Administração de Categorias (Admin)**  
   O administrador pode:
   - Criar novas categorias de notícias (Ex: Eventos, Cursos, Informativos)
   - Editar ou remover categorias existentes

3. **Criação de Notícias (Publicador/Admin)**  
   Usuários autenticados podem:
   - Criar notícias com título, conteúdo, imagens, vídeos e links
   - Selecionar categoria e adicionar palavras-chave (tags)
   - Definir **data de publicação futura** e **data de expiração**
   - Salvar notícias como **rascunho** ou **enviar para aprovação**

4. **Aprovação de Notícias (Admin)**  
   - As notícias criadas por publicadores ficam com status **"PENDENTE"**
   - O administrador pode **aprovar ou rejeitar** notícias pendentes
   - Após aprovadas, elas são automaticamente publicadas na **página pública**

5. **Visualização Pública**  
   - Qualquer pessoa pode acessar a lista de notícias públicas
   - Filtros por **categoria**, **tags** e **palavras-chave**
   - **Busca inteligente** por título e conteúdo (Full-Text Search)
   - **Contador de visualizações** por notícia

6. **Edição com Controle de Mudanças**  
   - Notícias já publicadas podem ser editadas
   - As edições geram uma **mudança pendente**, que deve ser **reaprovada**

7. **Estatísticas e Métricas (Admin)**  
   - Painel com gráficos e números de acesso às notícias
   - Relatórios de desempenho por categoria e autor

8. **Notificações e Responsividade**  
   - Sistema de notificações visuais com **React Hot Toast**
   - Layout adaptável a **celular, tablet e desktop**

---

## 🧱 Stack e Pré-requisitos

| Componente          | Versão       | Link                                | Observações                                 |
|---------------------|--------------|-------------------------------------|---------------------------------------------|
| Node.js             | 20.x         | https://nodejs.org                  | Backend                                     |
| Next.js             | 15.x         | https://nextjs.org                  | Framework React para o frontend             |
| React               | 19.x         | https://react.dev                   | Biblioteca base do frontend                 |
| PostgreSQL          | 15.x         | https://www.postgresql.org          | Banco de dados relacional                   |
| Prisma ORM          | 6.8.2        | https://www.prisma.io               | ORM usado para acesso ao banco              |
| TypeScript          | 5.x          | https://www.typescriptlang.org      | Tipagem estática para JS                    |
| Tailwind CSS        | 4.x          | https://tailwindcss.com             | Estilização CSS utilitária                  |
| Zod                 | 3.25.x       | https://github.com/colinhacks/zod   | Validação de schemas                        |
| React Hook Form     | 7.59.0       | https://react-hook-form.com         | Gerenciamento de formulários                |
| TanStack Query      | 5.81.5       | https://tanstack.com/query/latest   | Gerenciamento de estado assíncrono          |
| Axios               | 1.10.0       | https://axios-http.com              | Cliente HTTP                                |
| React Hot Toast     | 2.5.2        | https://react-hot-toast.com         | Sistema de notificações toast               |
| Lucide React        | 0.525.0      | https://lucide.dev                  | Ícones para React                           |
| Radix UI            | múltiplas    | https://www.radix-ui.com            | Componentes acessíveis                      |
| Express             | 5.1.0        | https://expressjs.com               | Framework de rotas para Node.js             |
| dotenv              | 16.5.0       | https://github.com/motdotla/dotenv | Variáveis de ambiente                       |
| cors                | 2.8.5        | https://github.com/expressjs/cors   | Middleware CORS                             |
| node-cron           | 4.2.0        | https://github.com/node-cron/node-cron | Tarefas agendadas                         |
| Jest                | 29.7.0       | https://jestjs.io                   | Framework de testes unitários               |
| Lodash              | 4.17.21      | https://lodash.com                  | Utilitários para JS                         |

---

## 🚀 Como rodar o sistema

```bash
# 1. Abra o terminal no local onde deseja salvar o projeto 
# (Ex: Área de Trabalho, Documentos...)

# 2. Clone o repositório
git clone https://github.com/weslleysilv4/AS65A-N03.git

# 3. Acesse a pasta do projeto
cd AS65A-N03
```

---

#### 🧠 Backend (API e banco de dados)

```bash
# 4. Acesse a pasta do backend
cd backend

# 5. Copie o arquivo de variáveis de ambiente
cp .env.example .env

# 6. Instale as dependências
npm install

# 7. Crie e aplique as migrações do banco de dados
npx prisma migrate dev

# 8. Rode o servidor em modo de desenvolvimento
npm run dev

# O backend estará disponível em http://localhost:3000
```

---

#### 💻 Frontend (interface web)

> ⚠️ Em outro terminal separado (ou nova aba):

```bash
# 9. Acesse a pasta do frontend
cd frontend

# 10. Instale as dependências
npm install

# 11. Rode o frontend em modo de desenvolvimento
npm run dev

# O frontend estará disponível em http://localhost:3001
```

---

#### ✅ Verificação final

- Acesse: http://localhost:3001 no navegador
- Faça login com as contas de teste (admin ou publicador)
- Navegue pelas funcionalidades (criação de notícia, aprovação, etc.)
- Verifique se tudo está funcionando corretamente


---

## 🔐 Contas de Teste

| Papel       | Email               | Senha        |
|-------------|---------------------|--------------|
| Admin       | admin@ellp.com      | admin123     |
| Publicador  | publisher@ellp.com  | publisher123 |

---

## 📄 Documentação complementar

- [`/backend/README.md`](./backend/README.md): instruções técnicas da API e banco
- [`/frontend/README.md`](./frontend/README.md): detalhes da interface e comandos

---

📅 Última atualização: **Julho/2025**  
📁 Repositório: [AS65A-N03](https://github.com/weslleysilv4/AS65A-N03)
