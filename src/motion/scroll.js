import Lenis from 'lenis'

// Défilement fluide du site (Lenis). Tous les défilements automatiques passent par ici,
// pour suivre la même courbe que la molette. Sans Lenis (animations réduites), on retombe sur le navigateur.
let lenis = null
const HEADER = 88 // place laissée en haut quand on arrive sur une section

export function startSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  lenis = new Lenis({ autoRaf: true, lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.2 })
}

export function scrollToY(y, { instant = false } = {}) {
  if (lenis) lenis.scrollTo(y, { immediate: instant, duration: instant ? 0 : 1.1, force: true })
  else window.scrollTo({ top: y, behavior: instant ? 'instant' : 'smooth' })
}

export function scrollToEl(el, { instant = false, offset = -HEADER } = {}) {
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY + offset
  scrollToY(Math.max(0, y), { instant })
}

// Bloque le défilement de la page (écran de chargement, menu mobile)
export function lockScroll(locked) {
  document.documentElement.style.overflow = locked ? 'hidden' : ''
  if (lenis) locked ? lenis.stop() : lenis.start()
}
