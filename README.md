# Hub CSDT

Plataforma fullstack em Next.js para gestão de projetos com formulário público e painel administrativo protegido.

## Funcionalidades

- Cadastro público de projetos sem login
- Autenticação segura com JWT e senhas criptografadas
- Dashboard de projetos com busca e filtros
- Visualização de detalhes, edição, exclusão e registro de alterações
- Upload de arquivos local para anexos de projeto
- Design responsivo estilo CRM

## Tecnologias

- Frontend: Next.js + React + Tailwind CSS
- Backend: API Routes do Next.js
- Banco de dados: PostgreSQL via Prisma ORM
- Autenticação: JWT + cookies HTTP-only

## Instalação local

1. Copie o arquivo de ambiente:

```bash
cp .env.example .env
```

2. Atualize `DATABASE_URL` com sua conexão PostgreSQL.
3. Instale dependências:

```bash
npm install
```

4. Gere o cliente Prisma e aplique migrações:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. Crie o usuário administrativo:

```bash
npm run seed
```

6. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse `http://localhost:3000`.

## Usuário administrativo padrão

- Email: `admin@hubcsdt.com`
- Senha: `Hub2026!`

> Altere a senha do administrador em produção imediatamente.

## Deploy no Vercel

1. Faça commit do projeto em um repositório GitHub.
2. Conecte o repositório em [Vercel](https://vercel.com).
3. Defina as variáveis de ambiente no painel Vercel:
   - `DATABASE_URL`
   - `JWT_SECRET`
4. Execute o deploy.

### Observação de upload

O upload de arquivos é salvo em `public/uploads`. No Vercel, o armazenamento local é efêmero, portanto, use um serviço externo para produção real.

## Estrutura principal

- `app/` — páginas e layout do Next.js
- `pages/api/` — rotas da API
- `lib/` — lógica de autenticação e helpers
- `components/` — componentes reutilizáveis
- `prisma/` — esquema e seed do banco

## Notas de produção

- Mantenha `JWT_SECRET` seguro
- Use PostgreSQL em produção
- Atualize as políticas de CORS se necessário
