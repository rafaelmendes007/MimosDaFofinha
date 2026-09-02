/**
 * Tipos do schema Supabase (Postgres).
 * Placeholder da Etapa 1 — será substituído pelo schema completo na Etapa 3,
 * quando as tabelas (profiles, treats, redemptions, credit_transactions,
 * custom_requests) forem criadas.
 */
export interface Database {
  public: {
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
