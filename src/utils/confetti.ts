import confetti from 'canvas-confetti'

/** Confete discreto e elegante — um único burst curto, sem exagero. */
export function fireCelebration(): void {
  confetti({
    particleCount: 60,
    spread: 65,
    startVelocity: 32,
    gravity: 1,
    scalar: 0.8,
    ticks: 150,
    origin: { y: 0.7 },
    colors: ['#ddb877', '#f5e6c8', '#b23f6d'],
    disableForReducedMotion: true,
  })
}
