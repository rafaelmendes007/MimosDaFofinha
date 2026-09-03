-- ============================================================================
-- Mimos da Fofinha — Etapa 3: perfis de usuário e controle de acesso
--
-- ONDE RODAR: Supabase Dashboard do seu projeto → menu lateral "SQL Editor"
-- → "New query" → cole todo este arquivo → "Run".
-- Rode uma única vez, na ordem em que os arquivos de supabase/sql/ aparecem
-- (este é o 001, os próximos virão como 002, 003...).
-- ============================================================================

-- Papéis de acesso do app: usuária comum vs. administrador.
create type public.user_role as enum ('user', 'admin');

-- Um perfil por usuária/usuário autenticado (1:1 com auth.users, que é
-- gerenciado internamente pelo Supabase Auth).
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'user',
  display_name text not null default '',
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Perfil de cada usuária/usuário: papel (user/admin) e status do onboarding.';

-- Mantém updated_at em dia a cada alteração.
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- Cria automaticamente um perfil (role = 'user' por padrão) assim que uma
-- conta é criada no Supabase Auth — seja pelo Dashboard, seja por signup.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Helper "is_admin": consulta profiles ignorando RLS (security definer) para
-- evitar qualquer risco de recursão dentro da própria policy de profiles.
create function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = uid and role = 'admin'
  );
$$;

revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to authenticated;

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table public.profiles enable row level security;

grant select on public.profiles to authenticated;

create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_select_admin"
  on public.profiles for select
  to authenticated
  using (public.is_admin(auth.uid()));

-- De propósito: nenhuma policy de insert/update/delete é criada aqui.
-- Toda escrita em profiles acontece por funções SECURITY DEFINER (abaixo),
-- então a usuária nunca consegue alterar seu próprio "role" ou saldo
-- diretamente pelo client — mesmo que tente manipular a chamada à API.

-- Marca o onboarding como concluído para quem chamar, apenas na própria conta.
create function public.complete_onboarding()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set onboarding_completed_at = now()
  where id = auth.uid()
    and onboarding_completed_at is null;
end;
$$;

revoke all on function public.complete_onboarding() from public;
grant execute on function public.complete_onboarding() to authenticated;

-- ============================================================================
-- Como promover a administradora/administrador (fazer só uma vez, manualmente):
--
-- 1. Crie as duas contas em Authentication > Users > Add user (uma para você,
--    uma para ela), com "Auto Confirm User" marcado.
-- 2. Copie o UUID da sua conta (coluna "UID" na lista de usuários).
-- 3. Rode, substituindo o UUID:
--
--    update public.profiles set role = 'admin' where id = 'COLE-O-UUID-AQUI';
--
-- A conta dela permanece com role = 'user' (padrão), que é o esperado.
-- ============================================================================
