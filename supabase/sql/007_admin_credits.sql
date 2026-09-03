-- ============================================================================
-- Mimos da Fofinha — Etapa 8: admin adicionar créditos
--
-- ONDE RODAR: Supabase Dashboard → SQL Editor → New query → cole tudo → Run.
-- Rode depois do 006_custom_requests.sql.
-- ============================================================================

create function public.admin_grant_credits(
  p_user_id uuid,
  p_amount integer,
  p_note text default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance integer;
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'not_authorized';
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'invalid_amount';
  end if;

  insert into public.credit_transactions (user_id, amount, reason, created_by, note)
  values (p_user_id, p_amount, 'grant', auth.uid(), p_note);

  select coalesce(sum(amount), 0) into v_balance
  from public.credit_transactions
  where user_id = p_user_id;

  return v_balance;
end;
$$;

comment on function public.admin_grant_credits(uuid, integer, text) is
  'Concede créditos a uma usuária. Só pode ser chamada por quem tem role = admin.';

revoke all on function public.admin_grant_credits(uuid, integer, text) from public;
grant execute on function public.admin_grant_credits(uuid, integer, text) to authenticated;
