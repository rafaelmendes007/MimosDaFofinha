-- ============================================================================
-- Mimos da Fofinha — Etapa 5: resgate transacional de mimos
--
-- ONDE RODAR: Supabase Dashboard → SQL Editor → New query → cole tudo → Run.
-- Rode depois do 003_credits_and_redemptions.sql.
--
-- Esta função é o coração do sistema de créditos: verifica saldo, desconta
-- créditos e registra o resgate numa única transação atômica — se qualquer
-- passo falhar, nada é gravado (nunca fica "saldo descontado sem histórico").
-- ============================================================================

create function public.redeem_treat(p_treat_id uuid)
returns table (redemption_id uuid, new_balance integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_cost integer;
  v_is_active boolean;
  v_balance integer;
  v_redemption_id uuid;
begin
  if v_user_id is null then
    raise exception 'not_authenticated';
  end if;

  -- Serializa chamadas concorrentes da mesma usuária (ex.: duplo toque no
  -- botão), evitando resgatar duas vezes com o mesmo saldo "antigo".
  perform pg_advisory_xact_lock(hashtext(v_user_id::text));

  select cost_credits, is_active into v_cost, v_is_active
  from public.treats
  where id = p_treat_id;

  if not found or not v_is_active then
    raise exception 'treat_not_found';
  end if;

  select coalesce(sum(amount), 0) into v_balance
  from public.credit_transactions
  where user_id = v_user_id;

  if v_balance < v_cost then
    raise exception 'insufficient_credits';
  end if;

  insert into public.credit_transactions (user_id, amount, reason, created_by)
  values (v_user_id, -v_cost, 'redemption', v_user_id);

  insert into public.redemptions (user_id, treat_id, cost_credits)
  values (v_user_id, p_treat_id, v_cost)
  returning id into v_redemption_id;

  return query select v_redemption_id, (v_balance - v_cost);
end;
$$;

comment on function public.redeem_treat(uuid) is
  'Resgata um mimo para quem chama a função: valida saldo, desconta créditos e registra o resgate atomicamente.';

revoke all on function public.redeem_treat(uuid) from public;
grant execute on function public.redeem_treat(uuid) to authenticated;
