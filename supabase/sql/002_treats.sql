-- ============================================================================
-- Mimos da Fofinha — Etapa 4: catálogo de mimos
--
-- ONDE RODAR: Supabase Dashboard → SQL Editor → New query → cole tudo → Run.
-- Rode depois do 001_profiles.sql.
-- ============================================================================

create table public.treats (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  icon text not null default '🎁',
  cost_credits integer not null check (cost_credits > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.treats is 'Catálogo de mimos disponíveis para resgate.';

create trigger treats_set_updated_at
  before update on public.treats
  for each row
  execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table public.treats enable row level security;

grant select on public.treats to authenticated;

-- Usuária comum só vê mimos ativos; admin vê tudo (inclusive desativados,
-- útil para a área administrativa da Etapa 8).
create policy "treats_select_active_or_admin"
  on public.treats for select
  to authenticated
  using (is_active or public.is_admin(auth.uid()));

-- De propósito: nenhuma policy de insert/update/delete aqui. Criar, editar e
-- desativar mimos é uma operação administrativa — a Etapa 8 adiciona funções
-- SECURITY DEFINER restritas a quem tem role = 'admin'.

-- ----------------------------------------------------------------------------
-- Dados de exemplo, para o catálogo não nascer vazio. Edite/apague à vontade.
-- ----------------------------------------------------------------------------
insert into public.treats (name, description, icon, cost_credits) values
  ('Vale Açaí', 'Aquele açaí de sempre, do jeitinho que você gosta.', '🍧', 1),
  ('Vale Abraço', 'Um abraço demorado, sem pressa nenhuma.', '🤗', 1),
  ('Vale Escolher o Filme', 'Você escolhe, eu assisto sem reclamar.', '🎞️', 1),
  ('Vale Pizza', 'Uma pizza escolhida por você para comermos juntos.', '🍕', 2),
  ('Vale Cinema', 'Sessão de cinema, pipoca incluída.', '🎬', 2),
  ('Vale Surpresa', 'Uma surpresa preparada com carinho.', '🎁', 2),
  ('Vale Jantar', 'Um jantar especial, só nós dois.', '🍽️', 3),
  ('Vale Massagem', 'Um momento só seu, de relaxar de verdade.', '💆', 3),
  ('Vale Um Dia Especial', 'Um dia inteiro planejado só para você.', '🌷', 5);
