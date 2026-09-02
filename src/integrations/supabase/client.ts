import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'
import type { Database } from '@/types/database'

/**
 * Cliente Supabase único do app, usando a chave pública (anon).
 * A segurança de acesso é garantida pelas políticas de Row Level Security
 * no banco — nunca pela chave usada aqui. A service_role key NUNCA deve
 * ser usada no frontend.
 */
export const supabase = createClient<Database>(
  env.supabaseUrl,
  env.supabaseAnonKey,
)
