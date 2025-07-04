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

---

## 🧱 Tecnologias Utilizadas

| Ferramenta          | Versão     | Link                            |
|---------------------|------------|---------------------------------|
| Next.js             | 15.x       | https://nextjs.org              |
| React               | 19.x       | https://react.dev               |
| TypeScript          | 5.x        | https://www.typescriptlang.org  |
| Tailwind CSS        | 4.x        | https://tailwindcss.com         |
| React Hook Form     | 7.59.0     | https://react-hook-form.com     |
| Zod                 | 3.25.x     | https://github.com/colinhacks/zod |
| TanStack Query      | 5.81.5     | https://tanstack.com/query/v5   |
| Axios               | 1.10.0     | https://axios-http.com          |
| Lucide React        | 0.525.0    | https://lucide.dev              |
| Radix UI            | múltiplas  | https://www.radix-ui.com        |
| React Hot Toast     | 2.5.2      | https://react-hot-toast.com     |

---

## 📁 Estrutura de Pastas

```
frontend/
├── pages/         # Rotas e páginas da aplicação
│   ├── index.tsx
│   ├── login.tsx
│   ├── dashboard/
├── components/    # Componentes reutilizáveis
├── services/      # Configuração do Axios e chamadas de API
├── hooks/         # Hooks customizados
├── styles/        # Estilos globais
└── public/        # Arquivos estáticos
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
npm run dev       # Executar em modo desenvolvimento
npm run build     # Gerar build de produção
npm start         # Rodar versão compilada
npm run lint      # Verificar problemas de lint
npm run lint -- --fix  # Corrigir automaticamente
```

---

📅 Última atualização: **Julho/2025**
