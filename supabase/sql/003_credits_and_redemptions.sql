-- ============================================================================
-- Mimos da Fofinha — Etapa 4: base do sistema de créditos e resgates
--
-- ONDE RODAR: Supabase Dashboard → SQL Editor → New query → cole tudo → Run.
-- Rode depois do 002_treats.sql.
--
-- Este script cria só o "esqueleto" (tabelas + leitura via RLS): o saldo é
-- calculado a partir do ledger, e o catálogo já consegue mostrar quantas
-- vezes cada mimo foi resgatado. A ação de resgatar de verdade — a função
-- transacional que desconta créditos e grava o resgate de forma atômica,
-- com confirmação e animação — chega no script da Etapa 5.
-- ============================================================================

-- Ledger de créditos: cada linha é um evento (positivo = crédito concedido,
-- negativo = crédito usado). O saldo é sempre a soma desta tabela — nunca um
-- número solto — então nada se perde por inconsistência.
create table public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  amount integer not null check (amount <> 0),
  reason text not null check (reason in ('grant', 'redemption', 'adjustment', 'custom_request_approved')),
  note text,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now()
);

comment on table public.credit_transactions is
  'Ledger de créditos. O saldo de cada usuária é sempre soma(amount).';

create index credit_transactions_user_id_idx on public.credit_transactions (user_id);

alter table public.credit_transactions enable row level security;
grant select on public.credit_transactions to authenticated;

create policy "credit_transactions_select_own_or_admin"
  on public.credit_transactions for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin(auth.uid()));

-- Histórico de resgates ("Memórias"), um registro por vez que um mimo foi
-- trocado por créditos.
create table public.redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  treat_id uuid not null references public.treats (id) on delete restrict,
  cost_credits integer not null check (cost_credits > 0),
  note text,
  redeemed_at timestamptz not null default now()
);

comment on table public.redemptions is 'Cada resgate de um mimo — a linha do tempo de memórias do casal.';

create index redemptions_user_id_idx on public.redemptions (user_id);
create index redemptions_treat_id_idx on public.redemptions (treat_id);

alter table public.redemptions enable row level security;
grant select on public.redemptions to authenticated;

create policy "redemptions_select_own_or_admin"
  on public.redemptions for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin(auth.uid()));

-- De propósito: nenhuma policy de insert aqui ainda. A Etapa 5 adiciona a
-- função SECURITY DEFINER `redeem_treat(treat_id)`, que verifica saldo,
-- desconta créditos e grava o resgate em uma única transação atômica — e a
-- Etapa 8 adiciona a função para o admin conceder créditos.

-- ============================================================================
-- Para testar o saldo/histórico antes da Etapa 8 (admin) existir, você pode
-- conceder créditos manualmente. Substitua os UUIDs (pegue em
-- Authentication > Users) e rode:
--
--   insert into public.credit_transactions (user_id, amount, reason, created_by, note)
--   values ('UUID-DA-CONTA-DELA', 5, 'grant', 'UUID-DA-SUA-CONTA-ADMIN', 'Créditos iniciais de presente 💕');
-- ============================================================================
