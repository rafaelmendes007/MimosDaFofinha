# Mimos da Fofinha 💜

Um app (PWA) pessoal para trocar créditos por mimos e guardar as memórias de cada momento vivido — feito como presente de aniversário de namoro.

## O que o app faz

- Ela vê um saldo de créditos e um catálogo de "mimos" (vale-pizza, vale-abraço, vale-um-dia-especial...) para resgatar.
- Cada resgate desconta créditos automaticamente (de forma transacional — nunca fica saldo descontado sem histórico) e vira uma "memória" na linha do tempo.
- Ela também pode fazer um "pedido especial" (um texto livre) sem descontar créditos — fica pendente até você aprovar ou recusar.
- Você (administrador) tem um painel próprio para adicionar créditos, criar/editar mimos, e aprovar ou recusar pedidos especiais.
- Instalável como app no celular (PWA), funciona offline depois do primeiro acesso.

## Stack

- **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS v4 + Framer Motion
- **Backend:** Supabase (Auth + Postgres + Row Level Security)
- **PWA:** manifest + service worker (`vite-plugin-pwa`)
- **Deploy:** Vercel

---

## 1. Instalar o Node.js

Você precisa do Node.js versão 20 ou mais recente.

1. Acesse [nodejs.org](https://nodejs.org/) e baixe a versão **LTS**.
2. Instale seguindo o instalador padrão do seu sistema.
3. Confirme que funcionou, abrindo um terminal e rodando:
   ```bash
   node --version
   npm --version
   ```
   Deve mostrar algo como `v20.x.x` (ou maior) e uma versão do npm.

## 2. Baixar o projeto e instalar as dependências

Se você ainda não tem o projeto na sua máquina, clone o repositório (troque pela URL do seu repositório no GitHub):

```bash
git clone https://github.com/rafaelmendes007/MimosDaFofinha.git
cd MimosDaFofinha
```

Instale as dependências:

```bash
npm install
```

## 3. Criar um projeto no Supabase

O Supabase é quem guarda os dados (usuárias, mimos, créditos, etc.) e cuida do login. É gratuito para esse uso.

1. Acesse [supabase.com](https://supabase.com/) e crie uma conta (dá para entrar com GitHub).
2. Clique em **New Project**.
3. Escolha uma organização (ou crie uma), dê um nome ao projeto (ex: `mimos-da-fofinha`), crie uma senha forte para o banco (guarde-a, mas ela não é usada no dia a dia) e escolha uma região próxima de você.
4. Aguarde alguns minutos até o projeto ficar pronto.

## 4. Rodar os scripts SQL (criar as tabelas)

Os scripts ficam em `supabase/sql/`, numerados na ordem exata em que devem ser executados. **Rode um de cada vez, na ordem, sem pular nenhum:**

1. No painel do seu projeto Supabase, abra o menu lateral **SQL Editor**.
2. Clique em **New query**.
3. Abra o arquivo `supabase/sql/001_profiles.sql` do projeto, copie todo o conteúdo, cole no editor e clique em **Run**.
4. Repita o mesmo processo, em ordem, para todos os arquivos seguintes:
   - `002_treats.sql`
   - `003_credits_and_redemptions.sql`
   - `004_redeem_treat.sql`
   - `005_treats_history_visibility.sql`
   - `006_custom_requests.sql`
   - `007_admin_credits.sql`
   - `008_admin_treats.sql`
   - `009_admin_custom_requests.sql`

Cada arquivo tem, no topo, um comentário explicando o que ele faz. Se algum der erro, o mais comum é ter pulado um arquivo anterior — confira a ordem.

Isso cria as tabelas, as políticas de segurança (RLS) e as funções do app. O `002_treats.sql` já cadastra alguns mimos de exemplo (Vale Pizza, Vale Açaí, etc.) para o catálogo não nascer vazio — edite ou apague pelo próprio app depois (área administrativa).

## 5. Configurar a autenticação (criar as duas contas)

Este app não tem uma tela pública de "criar conta" — por segurança, as contas são criadas direto no painel do Supabase.

1. No painel do Supabase, vá em **Authentication → Users**.
2. Clique em **Add user → Create new user**.
3. Crie a conta dela: e-mail e uma senha (pode ser temporária, ela troca depois se quiser — o app não tem tela de "esqueci minha senha" ainda, então combine uma senha com ela ou troque depois pelo próprio painel do Supabase). **Marque a opção "Auto Confirm User"**, senão o login não funciona sem confirmação por e-mail.
4. Repita o processo para criar a **sua** conta (a que vai virar administradora).

### Tornar sua conta administradora

Por padrão, toda conta nova nasce como usuária comum. Para promover a sua:

1. Ainda em **Authentication → Users**, copie o **UID** da sua conta (uma sequência tipo `a1b2c3d4-...`).
2. Volte no **SQL Editor**, abra uma nova query e rode (trocando pelo UID copiado):
   ```sql
   update public.profiles set role = 'admin' where id = 'COLE-O-UID-AQUI';
   ```
3. Pronto — a próxima vez que você logar com essa conta, o app libera a área administrativa (`/admin`).

## 6. Pegar as chaves da API e configurar as variáveis de ambiente

1. No painel do Supabase, vá em **Project Settings → API**.
2. Copie a **Project URL** e a chave **anon public** (não confunda com a `service_role` — essa nunca deve ser usada aqui).
3. Na raiz do projeto, copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```
4. Abra o `.env` e preencha:
   ```
   VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   ```
   O arquivo `.env` nunca é enviado para o GitHub (já está no `.gitignore`) — é só para a sua máquina.

## 7. Rodar o projeto localmente

```bash
npm run dev
```

Abra o endereço que aparecer no terminal (geralmente `http://localhost:5173`). Faça login com uma das contas que você criou no passo 5. No primeiro login dela, aparece a carta de aniversário (onboarding) — depois disso, não aparece mais.

Outros comandos úteis:

```bash
npm run build     # gera a versão de produção em dist/
npm run preview   # roda a versão de produção localmente, para testar antes do deploy
npm run lint       # checagem de qualidade do código
```

## 8. Editar a carta de aniversário

O texto da tela de boas-vindas fica em `src/pages/onboarding/OnboardingPage.tsx`, nas constantes `LETTER_TITLE` e `LETTER_BODY` — é só editar o texto ali, sem mexer em mais nada.

## 9. Conectar o projeto ao GitHub

Se o projeto ainda não está num repositório seu no GitHub:

1. Crie um repositório novo em [github.com/new](https://github.com/new) (pode ser privado — recomendado, já que é um presente pessoal).
2. Na raiz do projeto local, rode:
   ```bash
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   git push -u origin main
   ```
   (Se o projeto já veio de um `git clone`, esse passo já está feito.)

## 10. Conectar o GitHub à Vercel e configurar variáveis de ambiente

1. Acesse [vercel.com](https://vercel.com/) e crie uma conta (dá para entrar com GitHub).
2. Clique em **Add New → Project**.
3. Escolha o repositório do GitHub que você criou/usou no passo anterior. Autorize a Vercel a acessar seus repositórios se for pedido.
4. A Vercel detecta automaticamente que é um projeto Vite — não precisa mudar nada nas configurações de build.
5. Antes de clicar em **Deploy**, abra a seção **Environment Variables** e adicione as duas mesmas variáveis do seu `.env`:
   - `VITE_SUPABASE_URL` → a URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY` → a chave anon
6. Clique em **Deploy**. Em 1–2 minutos o app estará no ar, com uma URL tipo `https://seu-projeto.vercel.app`.

Depois do primeiro deploy, qualquer novo `git push` na branch principal gera um novo deploy automaticamente.

## 11. Instalar o PWA no celular

Depois que o app estiver publicado (com HTTPS, via Vercel):

**No Android (Chrome):**
1. Abra o link do app no Chrome.
2. Toque no menu (⋮) → **Adicionar à tela inicial** (ou vai aparecer um banner automático de instalação).

**No iPhone (Safari):**
1. Abra o link do app no Safari (importante: precisa ser no Safari, não funciona em outros navegadores no iOS).
2. Toque no ícone de compartilhar (□↑) → **Adicionar à Tela de Início**.

Depois disso, o app abre em tela cheia, com ícone próprio, como um app nativo.

> Instalação só funciona com HTTPS — em `localhost` também funciona (para testar), mas não em qualquer outro endereço sem certificado.

---

## Estrutura de pastas

```
src/
  pages/          # telas, organizadas por área (auth, onboarding, dashboard, catalog, history, requests, admin)
  components/     # componentes reutilizáveis (ui, layout, catalog, history, requests, admin, shared)
  hooks/          # hooks customizados (busca de dados, estado)
  services/       # camada de acesso a dados (chamadas ao Supabase)
  integrations/   # cliente do Supabase
  contexts/       # contextos React (autenticação)
  routes/         # definição de rotas e guards (RequireAuth, RequireAdmin)
  types/          # tipos TypeScript (domínio + schema do banco)
  lib/            # utilidades de baixo nível (leitura de env, etc.)
  utils/          # funções utilitárias (datas, mensagens, confete)
supabase/
  sql/            # scripts SQL, na ordem em que devem ser executados
```

## Segurança — o que foi levado em conta

- A chave usada no frontend é sempre a **anon key** (pública); a segurança de verdade vem das políticas de **Row Level Security** no banco, não de esconder telas.
- A usuária comum nunca consegue alterar seu próprio saldo, papel (`role`) ou aprovar os próprios pedidos — todas as operações sensíveis passam por funções `SECURITY DEFINER` no Postgres, que verificam quem está chamando antes de fazer qualquer alteração.
- O resgate de mimo e a aprovação de pedidos especiais são **transacionais**: se qualquer verificação falhar (saldo insuficiente, mimo inativo, etc.), nada é alterado no banco.
- A área administrativa (`/admin`) é protegida tanto na interface (redirecionamento se você não for admin) quanto no banco (RLS) — mesmo que alguém tentasse chamar a API diretamente, sem ser admin as operações são recusadas.
- Nenhuma senha, chave privada ou segredo fica no código-fonte; tudo sensível vem de variáveis de ambiente.

## Problema conhecido (não afeta o funcionamento)

A versão atual do `@supabase/supabase-js` tem uma limitação no sistema de tipos TypeScript para `.insert()`/`.rpc()` com parâmetros — em alguns pontos do código (comentados como tal) o client é tratado como não tipado só para aquela chamada específica, mantendo a segurança de tipos na entrada/saída de cada função de serviço. Isso não tem relação com segurança de dados (RLS continua sendo a autoridade), é só uma particularidade da biblioteca.
