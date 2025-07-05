# 💻 Frontend - ELLP News

Interface web do sistema ELLP News, responsável pela interação com o usuário, visualização de notícias, gerenciamento de conteúdo e controle de acesso baseado em permissões.

Construída com **Next.js**, **React** e **Tailwind CSS**, a interface é responsiva e adaptada para múltiplos dispositivos (desktop, tablet e mobile).

---

## 🎯 Funcionalidades

- Login seguro com validação de campos e mensagens visuais
- Painel administrativo com permissões distintas para:
  - **Administrador**: gerencia categorias, aprova/rejeita notícias
  - **Publicador**: cria, edita e agenda publicações
- Página pública com:
  - Lista de notícias
  - Busca com filtros por título, categoria e tags
  - Visualização de conteúdo completo
- Feedback visual com **React Hot Toast**
- Responsividade total (desktop, tablet e mobile)
- Sistema de busca avançada com filtros
- Dashboard com estatísticas em tempo real
- Upload e gerenciamento de imagens
- Sistema de notificações toast
- Validação de formulários com Zod
- Gerenciamento de estado com TanStack Query

---

## 🧱 Tecnologias Utilizadas

| Ferramenta          | Versão     | Link                            |
|---------------------|------------|---------------------------------|
| Next.js             | 15.3.4     | https://nextjs.org              |
| React               | 19.0.0     | https://react.dev               |
| TypeScript          | 5.x        | https://www.typescriptlang.org  |
| Tailwind CSS        | 4.x        | https://tailwindcss.com         |
| React Hook Form     | 7.59.0     | https://react-hook-form.com     |
| Zod                 | 3.25.71    | https://github.com/colinhacks/zod |
| TanStack Query      | 5.81.5     | https://tanstack.com/query/v5   |
| TanStack Query DevTools | 5.81.5 | https://tanstack.com/query/latest |
| Axios               | 1.10.0     | https://axios-http.com          |
| Lucide React        | 0.525.0    | https://lucide.dev              |
| Radix UI            | múltiplas  | https://www.radix-ui.com        |
| React Hot Toast     | 2.5.2      | https://react-hot-toast.com     |
| date-fns            | 4.1.0      | https://date-fns.org            |
| class-variance-authority | 0.7.1 | https://cva.style/docs          |
| clsx                | 2.1.1      | https://github.com/lukeed/clsx  |
| tailwind-merge      | 3.3.1      | https://github.com/dcastil/tailwind-merge |
| @hookform/resolvers | 5.1.1      | https://react-hook-form.com     |

---

## 📁 Estrutura de Pastas

```
frontend/
├── public/        # Arquivos estáticos (imagens, ícones, etc.)
└── src/
    ├── app/       # Páginas e rotas (App Router)
    │   ├── dashboard/  # Área administrativa
    │   ├── login/      # Página de autenticação
    │   ├── news/       # Visualização pública de notícias
    │   ├── search/     # Página de busca
    │   ├── globals.css # Estilos globais
    │   ├── layout.tsx  # Layout principal
    │   └── page.tsx    # Página inicial
    ├── components/     # Componentes React organizados
    │   ├── admin/      # Componentes administrativos
    │   ├── publisher/  # Componentes do publicador
    │   ├── ui/         # Componentes de interface (Radix UI)
    │   └── login/      # Componentes de autenticação
    ├── contexts/       # Contextos React (AuthContext)
    ├── hooks/          # Custom hooks React
    ├── lib/            # Configurações e utilitários
    ├── services/       # Serviços de API
    ├── types/          # Definições TypeScript
    ├── utils/          # Funções auxiliares
    └── middleware.ts   # Middleware Next.js
```

---

## 🚀 Como rodar o frontend

> ⚠️ Certifique-se de que o backend já está rodando em `http://localhost:3000`

```bash
# 1. Acesse a pasta do frontend
cd frontend

# 2. Instale as dependências
npm install

# 3. Execute o servidor de desenvolvimento 
npm run dev

# Acesse a aplicação em:
http://localhost:3001
```

---

## 🧪 Testes visuais sugeridos

1. Login com as contas de teste:
   - admin@ellp.com / admin123
   - publisher@ellp.com / publisher123

2. Criação de notícias (com imagens, tags, datas agendadas)

3. Aprovação de notícias (admin)

4. Edição com mudança pendente

5. Busca e filtros por categoria/tags

6. Responsividade:
   - Celular
   - Tablet
   - Desktop
   - Modo claro/escuro (se aplicável)

---

## 🛠️ Comandos úteis

```bash
npm run dev       # Executar em modo desenvolvimento (porta 3001)
npm run build     # Gerar build de produção
npm start         # Rodar versão compilada
npm run lint      # Verificar problemas de lint
npm run lint -- --fix  # Corrigir automaticamente
```

---

## 🔧 Ferramentas de Desenvolvimento

- **ESLint**: Configurado com `eslint-config-next`
- **TypeScript**: Tipagem estática para JavaScript
- **Tailwind CSS v4**: Framework CSS utilitário
- **Turbopack**: Bundler rápido para desenvolvimento
- **React DevTools**: Para debugging de componentes
- **TanStack Query DevTools**: Para debugging de queries

---

📅 Última atualização: **Julho/2025**
