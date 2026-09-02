/** Camada decorativa de luz ambiente (gradientes suaves), sem imagens externas. */
export function BackgroundGlow() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-ink-950" />
      <div className="absolute -top-32 -left-24 size-80 rounded-full bg-wine-500/25 blur-[110px] animate-float" />
      <div
        className="absolute top-1/3 -right-24 size-96 rounded-full bg-gold-500/15 blur-[130px] animate-float"
        style={{ animationDelay: '-3s' }}
      />
      <div className="absolute bottom-0 left-1/4 size-72 rounded-full bg-ink-500/40 blur-[100px]" />
    </div>
  )
}
