import { useEffect, useId, useState } from 'react'

// Mode clair / sombre. Par défaut on suit le réglage de l'appareil ; un choix fait sur le site est retenu.
// La classe `dark` est posée sur <html> dès le chargement (script dans index.html) pour éviter un flash.
const KEY = 'thelab-theme'
const media = () => window.matchMedia('(prefers-color-scheme: dark)')

const stored = () => {
  try { return localStorage.getItem(KEY) } catch { return null }
}
const current = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')

function apply(theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#161513' : '#111111')
  window.dispatchEvent(new CustomEvent('themechange', { detail: theme }))
}

// Bascule avec un cercle qui s'ouvre depuis le bouton (View Transitions quand le navigateur sait le faire)
export function toggleTheme(event) {
  const next = current() === 'dark' ? 'light' : 'dark'
  try { localStorage.setItem(KEY, next) } catch { /* navigation privée */ }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduced) return apply(next)
  const rect = event?.currentTarget?.getBoundingClientRect()
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
  const y = rect ? rect.top + rect.height / 2 : 0
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  const transition = document.startViewTransition(() => apply(next))
  transition.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 650, easing: 'cubic-bezier(.16,1,.3,1)', pseudoElement: '::view-transition-new(root)' },
    )
  }).catch(() => {})
}

export function useTheme() {
  const [theme, setTheme] = useState(current)
  useEffect(() => {
    const onChange = (e) => setTheme(e.detail)
    // Sans choix enregistré, on suit l'appareil s'il change (ex. passage auto en sombre le soir)
    const onSystem = (e) => { if (!stored()) apply(e.matches ? 'dark' : 'light') }
    const m = media()
    window.addEventListener('themechange', onChange)
    m.addEventListener('change', onSystem)
    return () => {
      window.removeEventListener('themechange', onChange)
      m.removeEventListener('change', onSystem)
    }
  }, [])
  return theme
}

// Petit bouton soleil / lune
export function ThemeToggle({ className = '', ...props }) {
  const theme = useTheme()
  const dark = theme === 'dark'
  const maskId = `thelab-moon-${useId().replace(/:/g, '')}`
  return (
    <button
      type="button"
      {...props}
      onClick={toggleTheme}
      aria-label={dark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      aria-pressed={dark}
      className={`group relative grid size-9 place-items-center rounded-full border border-current/15 transition-colors hover:border-bronze hover:text-bronze ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        {/* Le soleil se change en lune : le disque grossit, un second cercle le croque, les rayons rentrent */}
        <mask id={maskId}>
          <rect width="24" height="24" fill="white" />
          <circle cx={dark ? 17 : 30} cy={dark ? 7 : -6} r="6" fill="black" style={{ transition: 'cx .5s, cy .5s' }} />
        </mask>
        <circle cx="12" cy="12" r={dark ? 8 : 4.5} fill="currentColor" stroke="none" mask={`url(#${maskId})`} style={{ transition: 'r .5s cubic-bezier(.16,1,.3,1)' }} />
        <g style={{ opacity: dark ? 0 : 1, transform: `rotate(${dark ? 45 : 0}deg) scale(${dark ? 0.5 : 1})`, transformOrigin: '12px 12px', transition: 'opacity .3s, transform .5s cubic-bezier(.16,1,.3,1)' }}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1="12" y1="2.5" x2="12" y2="4.2" transform={`rotate(${a} 12 12)`} />
          ))}
        </g>
      </svg>
    </button>
  )
}
