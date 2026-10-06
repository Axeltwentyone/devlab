import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Logo from './Logo.jsx'
import { whatsappLink } from '../data/site.js'

const LINKS = [
  { href: '#pourquoi', label: 'Pourquoi nous' },
  { href: '#methode', label: 'Méthode' },
  { href: '#index', label: 'Projets' },
  { href: '#diagnostic', label: 'Diagnostic' },
  { href: '#formules', label: 'Formules' },
  { href: '#contact', label: 'Contact' },
]

function useAbidjanTime() {
  const format = () =>
    new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Abidjan' }).format(new Date())
  const [time, setTime] = useState(format)
  useEffect(() => {
    const id = setInterval(() => setTime(format()), 15_000)
    return () => clearInterval(id)
  }, [])
  return time
}

// Section visible à l'écran : la dernière dont le haut a dépassé le tiers de la fenêtre.
function useScrollState() {
  const [state, setState] = useState({ active: null, progress: 0, scrolled: false })
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight / 3
      let active = null
      for (const l of LINKS) {
        const el = document.querySelector(l.href)
        if (el && el.getBoundingClientRect().top <= line) active = l.href
      }
      const max = document.documentElement.scrollHeight - window.innerHeight
      const atBottom = window.scrollY >= max - 4
      if (atBottom) active = '#contact'
      setState({ active, progress: max > 0 ? window.scrollY / max : 0, scrolled: window.scrollY > 8 })
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return state
}

export default function TopBar() {
  const time = useAbidjanTime()
  const [open, setOpen] = useState(false)
  const { active, progress, scrolled } = useScrollState()
  const [hovered, setHovered] = useState(null)
  const navRef = useRef(null)
  const [bar, setBar] = useState(null)

  // Le trait glisse sous le lien survolé, sinon sous la section en cours.
  const target = hovered ?? active
  useLayoutEffect(() => {
    const nav = navRef.current
    const link = target && nav?.querySelector(`a[href="${target}"]`)
    if (!link) return setBar(null)
    setBar({ left: link.offsetLeft, width: link.offsetWidth })
  }, [target])

  // Menu mobile : page figée derrière, Échap pour fermer
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header
      className={`sticky top-0 z-40 pt-[env(safe-area-inset-top)] backdrop-blur-md transition-[background-color,box-shadow] duration-300 ${
        scrolled || open ? 'bg-white/85 shadow-[0_1px_0_var(--color-pierre)]' : 'bg-white'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5 md:h-[84px] md:px-[72px]">
        <a href="#top" aria-label="Retour en haut de page" onClick={() => setOpen(false)}>
          <Logo className="text-[22px] md:text-2xl" />
        </a>

        <p className="text-[13px] text-gris lg:hidden xl:block">
          <span className="font-medium text-encre">Abidjan</span> <time>{time}</time>
        </p>

        <nav
          ref={navRef}
          onPointerLeave={() => setHovered(null)}
          className="relative hidden items-center gap-7 text-sm lg:flex"
          aria-label="Navigation principale"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onPointerEnter={() => setHovered(l.href)}
              onFocus={() => setHovered(l.href)}
              onBlur={() => setHovered(null)}
              aria-current={active === l.href ? 'location' : undefined}
              className={`py-2 transition-colors duration-300 ${target === l.href ? 'text-encre' : 'text-gris hover:text-encre'}`}
            >
              {l.label}
            </a>
          ))}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0.5 h-px bg-encre transition-all duration-500 ease-[cubic-bezier(.2,.7,.2,1)]"
            style={{ left: bar?.left ?? 0, width: bar?.width ?? 0, opacity: bar ? 1 : 0 }}
          />
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            onPointerEnter={() => setHovered(null)}
            className="ml-2 inline-flex items-center gap-2 rounded-full bg-encre px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-bronze"
          >
            <span className="size-1.5 rounded-full bg-[#3BD16F]" aria-hidden="true" />
            WhatsApp
          </a>
        </nav>

        <button
          type="button"
          className="flex items-center gap-2 text-[13px] font-medium lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Fermer' : 'Menu'}
          <span aria-hidden="true" className="relative block h-2.5 w-4">
            <span className="absolute left-0 top-0 h-px w-4 bg-encre transition-transform duration-300" style={{ transform: open ? 'translateY(4.5px) rotate(45deg)' : 'none' }} />
            <span className="absolute bottom-0 left-0 h-px w-4 bg-encre transition-transform duration-300" style={{ transform: open ? 'translateY(-4.5px) rotate(-45deg)' : 'none' }} />
          </span>
        </button>
      </div>

      {/* Fil de lecture : avance avec le scroll */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-px origin-left bg-bronze"
        style={{ width: '100%', transform: `scaleX(${progress})` }}
      />

      {open && (
        <nav
          id="menu-mobile"
          className="h-[calc(100svh-4rem)] overflow-y-auto border-t border-fond bg-white px-5 pb-10 pt-4 md:h-[calc(100svh-84px)] lg:hidden"
          aria-label="Navigation mobile"
        >
          <ul className="flex flex-col">
            {LINKS.map((l, i) => (
              <li key={l.href} className="border-b border-fond">
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={active === l.href ? 'location' : undefined}
                  className={`flex items-baseline gap-4 py-4 text-3xl font-extrabold tracking-[-0.04em] ${active === l.href ? 'text-encre' : 'text-encre/45'}`}
                >
                  <span className="w-6 text-xs font-medium tracking-normal text-gris">{String(i + 1).padStart(2, '0')}</span>
                  {l.label}
                  {active === l.href && <span className="size-2 self-center rounded-full bg-bronze" aria-hidden="true" />}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="mt-8 flex items-center justify-center gap-2 rounded-full bg-encre py-4 text-base font-medium text-white"
          >
            <span className="size-2 rounded-full bg-[#3BD16F]" aria-hidden="true" />
            Écrire sur WhatsApp
          </a>
          <p className="mt-4 text-center text-[13px] text-gris">Abidjan · {time}</p>
        </nav>
      )}
    </header>
  )
}
