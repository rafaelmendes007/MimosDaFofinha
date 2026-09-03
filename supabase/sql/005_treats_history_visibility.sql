-- ============================================================================
-- Mimos da Fofinha — Etapa 6: garantir que memórias antigas nunca somem
--
-- ONDE RODAR: Supabase Dashboard → SQL Editor → New query → cole tudo → Run.
-- Rode depois do 004_redeem_treat.sql.
--
-- A policy de treats (002_treats.sql) só deixa ver mimos ativos. Isso é
-- ótimo pro catálogo, mas ruim pra "Memórias": se um mimo for desativado no
-- futuro (Etapa 8), o resgate dele no histórico perderia nome/ícone/
-- descrição. Esta policy adicional garante que um mimo continua visível
-- para quem já o resgatou alguma vez, ativo ou não.
-- ============================================================================

create policy "treats_select_via_own_redemption"
  on public.treats for select
  to authenticated
  using (
    exists (
      select 1
      from public.redemptions r
      where r.treat_id = treats.id
        and r.user_id = auth.uid()
    )
  );
