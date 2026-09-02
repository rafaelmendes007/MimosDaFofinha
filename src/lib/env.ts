/** Leitura tipada e validada das variáveis de ambiente do Vite. */

function readEnvVar(key: string): string {
  const value = import.meta.env[key]
  if (!value) {
    throw new Error(
      `Variável de ambiente "${key}" não definida. Confira o arquivo .env (veja .env.example).`,
    )
  }
  return value
}

export const env = {
  supabaseUrl: readEnvVar('VITE_SUPABASE_URL'),
  supabaseAnonKey: readEnvVar('VITE_SUPABASE_ANON_KEY'),
}
