-- ============================================================================
-- Mimos da Fofinha — Etapa 7: pedidos personalizados
--
-- ONDE RODAR: Supabase Dashboard → SQL Editor → New query → cole tudo → Run.
-- Rode depois do 005_treats_history_visibility.sql.
--
-- "Pedido especial": a usuária escreve o que gostaria, isso vira uma
-- solicitação pendente — SEM descontar créditos automaticamente. Só o admin
-- decide aprovar (definindo quantos créditos) ou recusar. A tela/função de
-- aprovação em si é a Etapa 8; aqui já criamos a tabela pronta para isso.
-- ============================================================================

create table public.custom_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  message text not null check (char_length(trim(message)) > 0),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  approved_cost_credits integer check (approved_cost_credits is null or approved_cost_credits > 0),
  admin_note text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references auth.users (id)
);

comment on table public.custom_requests is
  'Pedidos especiais escritos livremente pela usuária, aguardando aprovação do admin.';

create index custom_requests_user_id_idx on public.custom_requests (user_id);

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table public.custom_requests enable row level security;

grant select, insert on public.custom_requests to authenticated;

create policy "custom_requests_select_own_or_admin"
  on public.custom_requests for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin(auth.uid()));

-- A usuária só consegue criar um pedido em nome dela mesma, sempre como
-- "pending" e sem nenhum campo que é de decisão do admin (approved_cost_credits,
-- admin_note, resolved_at/resolved_by têm que vir vazios). Isso garante, só
-- com RLS, que ela nunca consegue se auto-aprovar um pedido.
create policy "custom_requests_insert_own_pending"
  on public.custom_requests for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and status = 'pending'
    and approved_cost_credits is null
    and admin_note is null
    and resolved_at is null
    and resolved_by is null
  );

-- De propósito: nenhuma policy de update/delete aqui. Aprovar ou recusar um
-- pedido é operação administrativa — a Etapa 8 adiciona uma função
-- SECURITY DEFINER restrita a quem tem role = 'admin'.
