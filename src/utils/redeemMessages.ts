const SUCCESS_MESSAGES = [
  'Resgate realizado! 💕 Agora só falta transformar esse mimo em uma memória.',
  'Combinado. 🤍 Só falta marcar o dia pra viver isso de verdade.',
  'Prontinho. ✨ Mais um motivo pra gente se encontrar.',
  'Feito! 💫 Guarda esse momento — daqui a pouco ele vira memória.',
]

export function pickSuccessMessage(): string {
  return SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]
}
