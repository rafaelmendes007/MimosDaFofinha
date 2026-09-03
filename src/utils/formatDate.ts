const fullDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

/** Ex.: "15 de setembro de 2026" */
export function formatFullDate(iso: string): string {
  return fullDateFormatter.format(new Date(iso))
}
