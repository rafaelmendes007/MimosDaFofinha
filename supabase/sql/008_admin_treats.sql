-- ============================================================================
-- Mimos da Fofinha — Etapa 8: admin criar/editar/desativar mimos
--
-- ONDE RODAR: Supabase Dashboard → SQL Editor → New query → cole tudo → Run.
-- Rode depois do 007_admin_credits.sql.
--
-- Diferente do ledger de créditos, mimos são só metadados de catálogo (não
-- há um invariante como "saldo nunca negativo" para proteger), então aqui
-- basta autorizar a escrita via RLS gated por is_admin() — sem precisar de
-- função SECURITY DEFINER.
--
-- "Excluir" um mimo é sempre um soft-delete (is_active = false), nunca um
-- delete de verdade: assim os resgates antigos desse mimo (Memórias) nunca
-- ficam órfãos.
-- ============================================================================

grant insert, update on public.treats to authenticated;

create policy "treats_insert_admin"
  on public.treats for insert
  to authenticated
  with check (public.is_admin(auth.uid()));

create policy "treats_update_admin"
  on public.treats for update
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));
