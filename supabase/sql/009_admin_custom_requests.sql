-- ============================================================================
-- Mimos da Fofinha — Etapa 8: admin aprovar/recusar pedidos especiais
--
-- ONDE RODAR: Supabase Dashboard → SQL Editor → New query → cole tudo → Run.
-- Rode depois do 008_admin_treats.sql.
--
-- Aprovar um pedido funciona como um resgate manual: define quantos créditos
-- ele "vale" e desconta na hora (reason = 'custom_request_approved'), com a
-- mesma garantia de saldo nunca ficar negativo que o resgate normal tem.
-- Tudo dentro de uma função só, então é atômico — se qualquer verificação
-- falhar, nada é alterado.
-- ============================================================================

create function public.admin_resolve_custom_request(
  p_request_id uuid,
  p_decision text,
  p_cost_credits integer default null,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_status text;
  v_balance integer;
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'not_authorized';
  end if;

  if p_decision not in ('approved', 'rejected') then
    raise exception 'invalid_decision';
  end if;

  select user_id, status into v_user_id, v_status
  from public.custom_requests
  where id = p_request_id
  for update;

  if not found then
    raise exception 'request_not_found';
  end if;

  if v_status <> 'pending' then
    raise exception 'request_already_resolved';
  end if;

  if p_decision = 'approved' then
    if p_cost_credits is null or p_cost_credits <= 0 then
      raise exception 'invalid_cost';
    end if;

    select coalesce(sum(amount), 0) into v_balance
    from public.credit_transactions
    where user_id = v_user_id;

    if v_balance < p_cost_credits then
      raise exception 'insufficient_credits';
    end if;

    insert into public.credit_transactions (user_id, amount, reason, created_by, note)
    values (v_user_id, -p_cost_credits, 'custom_request_approved', auth.uid(), p_note);

    update public.custom_requests
    set status = 'approved',
        approved_cost_credits = p_cost_credits,
        admin_note = p_note,
        resolved_at = now(),
        resolved_by = auth.uid()
    where id = p_request_id;
  else
    update public.custom_requests
    set status = 'rejected',
        admin_note = p_note,
        resolved_at = now(),
        resolved_by = auth.uid()
    where id = p_request_id;
  end if;
end;
$$;

comment on function public.admin_resolve_custom_request(uuid, text, integer, text) is
  'Aprova (descontando créditos) ou recusa um pedido especial. Só admin.';

revoke all on function public.admin_resolve_custom_request(uuid, text, integer, text) from public;
grant execute on function public.admin_resolve_custom_request(uuid, text, integer, text) to authenticated;
