# Mimos da Fofinha 💜

Um app (PWA) pessoal para trocar créditos por mimos e guardar as memórias de cada um deles.

> Projeto em desenvolvimento por etapas. Este README será substituído por um
> guia completo de instalação, configuração do Supabase e deploy na Etapa 10.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- Framer Motion
- Supabase (Auth + Postgres + RLS)
- PWA (manifest + service worker)
- Deploy: Vercel

## Rodando localmente (por enquanto)

```bash
npm install
cp .env.example .env   # preencha com as chaves do seu projeto Supabase
npm run dev
```

## Estrutura de pastas

```
src/
  pages/          # telas, organizadas por área (auth, onboarding, dashboard, catalog, history, requests, admin)
  components/     # componentes reutilizáveis (ui, layout, catalog, history, requests, admin, shared)
  hooks/          # hooks customizados
  services/       # camada de acesso a dados (Supabase)
  integrations/   # clientes de serviços externos (Supabase)
  contexts/       # contextos React (ex: autenticação)
  routes/         # definição de rotas
  types/          # tipos TypeScript (domínio + schema do banco)
  lib/            # utilidades de baixo nível (env, etc.)
  utils/          # funções utilitárias
supabase/
  sql/            # scripts SQL (schema, RLS, funções) — Etapa 3+
```
