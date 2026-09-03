/** Traduz mensagens de erro do Supabase Auth para algo humano em pt-BR. */
export function translateAuthError(message: string): string {
  const normalized = message.toLowerCase()

  if (normalized.includes('invalid login credentials')) {
    return 'E-mail ou senha incorretos.'
  }
  if (normalized.includes('email not confirmed')) {
    return 'Esse e-mail ainda não foi confirmado.'
  }
  if (normalized.includes('too many requests')) {
    return 'Muitas tentativas seguidas. Espere um pouco e tente de novo.'
  }
  return 'Não foi possível entrar agora. Tente novamente em instantes.'
}
