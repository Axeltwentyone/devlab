import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Logo, { Mark } from './Logo.jsx'
import { useWhatsapp } from '../content/ContentContext.jsx'
import { useRouter } from '../router.jsx'
import { lockScroll } from '../motion/scroll.js'
import { ThemeToggle } from '../theme.jsx'

// `page` : le lien est actif sur cette page (et ses sous-pages).
// `spy` : sections de l'accueil qui l'activent quand on les fait défiler.
const LINKS = [
  { href: '/', label: 'Accueil', page: '/', spy: [] },
  { href: '/studio', label: 'Le studio', page: '/studio', spy: ['#studio'] },
  { href: '/projets', label: 'Projets', page: '/projets', spy: ['#index'] },
  { href: '/formules', label: 'Formules', page: '/formules', spy: ['#formules'] },
  { href: '/diagnostic', label: 'Diagnostic', page: '/diagnostic', spy: ['#diagnostic'] },
  { href: '/contact', label: 'Contact', page: '/contact', spy: [] },
]

const EASE = 'cubic-bezier(.16,1,.3,1)'
const num = (i) => String(i + 1).padStart(2, '0')

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

// Lien actif (section passée la plus bas, sinon la page en cours) et progression de lecture
function useScrollState(path) {
  const [state, setState] = useState({ active: null, progress: 0 })
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight / 3
      let active = null
      let best = -Infinity
      for (const l of LINKS) {
        for (const sel of l.spy) {
          const top = document.querySelector(sel)?.getBoundingClientRect().top
          if (top !== undefined && top <= line && top > best) { best = top; active = l.href }
        }
      }
      const page = LINKS.find((l) => path === l.page || (l.page !== '/' && path.startsWith(`${l.page}/`)))
      if (!active && page) active = page.href
      const max = document.documentElement.scrollHeight - window.innerHeight
      setState({ active, progress: max > 0 ? Math.min(1, window.scrollY / max) : 0 })
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    const late = setTimeout(update, 120)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(late)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [path])
  return state
}

// Le bouton rond : une croix qui tourne, et un anneau bronze qui suit la lecture de la page
function Toggle({ open, hint, progress, onClick }) {
  const r = 30
  const c = 2 * Math.PI * r
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls="navigation"
      aria-label={open ? 'Fermer la navigation' : 'Ouvrir la navigation'}
      className="relative grid size-16 shrink-0 place-items-center"
    >
      <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--color-bronze)" strokeWidth="2" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - progress)} style={{ opacity: open ? 0 : 1, transition: 'opacity .3s' }} />
      </svg>
      {/* Fermé : le signe theLab ; ouvert : il tourne et laisse place à la croix */}
      <span
        aria-hidden="true"
        className="absolute transition-[transform,opacity] duration-700"
        style={{ transform: `rotate(${open ? 135 : hint ? -25 : 0}deg) scale(${open ? 0.4 : hint ? 1.12 : 1})`, opacity: open ? 0 : 1, transitionTimingFunction: EASE }}
      >
        <Mark className="h-[22px] w-auto" ring="#F3F2EE" />
      </span>
      <span
        aria-hidden="true"
        className="relative size-4 transition-[transform,opacity] duration-700"
        style={{ transform: `rotate(${open ? 45 : -90}deg) scale(${open ? 1 : 0.4})`, opacity: open ? 1 : 0, transitionTimingFunction: EASE }}
      >
        <span className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 rounded-full bg-white" />
        <span className="absolute left-1/2 top-0 h-4 w-[2px] -translate-x-1/2 rounded-full bg-white" />
      </span>
    </button>
  )
}

export default function TopBar() {
  const whatsappLink = useWhatsapp()
  const time = useAbidjanTime()
  const { path } = useRouter()
  const { active, progress } = useScrollState(path)
  const [open, setOpen] = useState(false)
  // « Menu » : au survol / au focus, et quelques secondes à l'arrivée sur un écran tactile
  const [hover, setHover] = useState(false)
  const [intro, setIntro] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(hover: hover)').matches) return
    setIntro(true)
    const id = setTimeout(() => setIntro(false), 3500)
    return () => clearTimeout(id)
  }, [])
  const hint = !open && (hover || intro)

  // Grand écran avec souris : la barre se déplie au survol et se replie quand la souris s'en va
  // (petit délai pour ne pas la refermer au moindre écart). Le clic marche toujours.
  const leaveTimer = useRef(0)
  const canHover = () => window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)').matches
  const onEnter = (e) => {
    if (e.pointerType !== 'mouse') return
    clearTimeout(leaveTimer.current)
    if (canHover()) setOpen(true)
    else setHover(true)
  }
  const onLeave = (e) => {
    setHover(false)
    if (e.pointerType !== 'mouse' || !canHover()) return
    clearTimeout(leaveTimer.current)
    leaveTimer.current = setTimeout(() => setOpen(false), 280)
  }
  useEffect(() => () => clearTimeout(leaveTimer.current), [])
  const [hovered, setHovered] = useState(null)
  const [width, setWidth] = useState(64)
  const [mark, setMark] = useState(null)
  const pillRef = useRef(null)
  const navRef = useRef(null)

  // Largeur ouverte = bouton + liens (mesurés)
  useLayoutEffect(() => {
    const measure = () => {
      const w = navRef.current?.scrollWidth || 0
      setWidth(w ? 64 + w + 8 : 64)
    }
    measure()
    document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // La pastille bronze glisse sous le lien survolé, sinon reste sous la page en cours
  const target = open ? hovered ?? active : null
  useLayoutEffect(() => {
    const link = target && navRef.current?.querySelector(`a[href="${target}"]`)
    setMark(link ? { left: link.offsetLeft, width: link.offsetWidth } : null)
  }, [target, open])

  // On referme en changeant de page, avec Échap, ou en cliquant ailleurs
  useEffect(() => { setOpen(false) }, [path])
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onDown = (e) => { if (!pillRef.current?.contains(e.target) && !e.target.closest('#menu-mobile')) setOpen(false) }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  // Mobile : page figée derrière le menu plein écran
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 1023px)').matches
    if (!open || !mobile) return
    lockScroll(true)
    return () => lockScroll(false)
  }, [open])

  return (
    <>
      {/* Haut de page : logo et heure d'Abidjan (ils défilent avec la page) */}
      <header className="relative z-30 pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:h-[84px] md:px-[72px]">
          <a href="/" aria-label="theLab. — accueil">
            <Logo mark className="text-[22px] md:text-2xl" />
          </a>
          <div className="flex items-center gap-3 md:gap-4">
            <p className="text-[13px] text-gris">
              <span className="font-medium text-encre max-[359px]:hidden">Abidjan </span><time>{time}</time>
            </p>
            <ThemeToggle className="text-encre" />
          </div>
        </div>
      </header>

      {/* La pastille : un rond qui s'ouvre en barre de navigation (grand écran) */}
      <div
        ref={pillRef}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        data-tone="dark"
        className="fixed left-1/2 top-[max(12px,env(safe-area-inset-top))] z-50 flex h-16 -translate-x-1/2 cursor-pointer items-center overflow-hidden rounded-full bg-encre text-white ring-1 ring-white/10 md:top-3"
        style={{
          width: open ? `min(${width}px, calc(100vw - 32px))` : 64,
          scale: hint ? '1.08' : '1',
          boxShadow: hint ? '0 16px 44px rgba(17,17,17,0.38), 0 0 0 6px rgba(169,119,74,0.18)' : '0 12px 40px rgba(17,17,17,0.28)',
          transition: `width .65s ${EASE}, scale .45s ${EASE}, box-shadow .45s`,
        }}
      >
        <Toggle open={open} hint={hint} progress={progress} onClick={() => setOpen((o) => !o)} />

        <nav
          id="navigation"
          ref={navRef}
          aria-label="Navigation principale"
          onPointerLeave={() => setHovered(null)}
          className="relative hidden items-center gap-1 pr-2 [perspective:700px] lg:flex"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 h-10 -translate-y-1/2 rounded-full bg-bronze"
            style={{ left: mark?.left ?? 0, width: mark?.width ?? 0, opacity: mark ? 1 : 0, transition: `left .55s ${EASE}, width .55s ${EASE}, opacity .3s` }}
          />
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              tabIndex={open ? 0 : -1}
              aria-current={active === l.href ? 'page' : undefined}
              onPointerEnter={() => setHovered(l.href)}
              onFocus={() => setHovered(l.href)}
              className="relative flex min-h-11 items-center gap-2 whitespace-nowrap px-4 text-[15px]"
              style={{
                opacity: open ? 1 : 0,
                transform: `rotateX(${open ? 0 : -92}deg)`,
                transformOrigin: '50% 0',
                transition: `opacity .45s, transform .7s ${EASE}`,
                transitionDelay: open ? `${0.14 + i * 0.07}s` : '0s',
              }}
            >
              <span className="text-[11px] tabular-nums tracking-[0.08em]" style={{ color: target === l.href ? 'rgba(255,255,255,.75)' : 'var(--color-doux)' }}>{num(i)}</span>
              {l.label}
            </a>
          ))}
          <span aria-hidden="true" className="mx-2 h-px w-6 bg-trait" style={{ opacity: open ? 1 : 0, transition: 'opacity .4s' }} />
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            tabIndex={open ? 0 : -1}
            onPointerEnter={() => setHovered(null)}
            className="relative flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 text-[14px] font-medium text-encre transition-colors hover:bg-[#3BD16F]"
            style={{
              opacity: open ? 1 : 0,
              transform: `rotateX(${open ? 0 : -92}deg)`,
              transformOrigin: '50% 0',
              transition: `opacity .45s, transform .7s ${EASE}, background-color .3s`,
              transitionDelay: open ? `${0.14 + LINKS.length * 0.07}s` : '0s',
            }}
          >
            <span className="size-1.5 rounded-full bg-[#3BD16F]" aria-hidden="true" />
            WhatsApp
          </a>
        </nav>
      </div>

      {/* Étiquette « Menu » sous la pastille fermée */}
      <span
        aria-hidden="true"
        data-tone="dark"
        className="label pointer-events-none fixed left-1/2 top-[calc(max(12px,env(safe-area-inset-top))+76px)] z-50 -translate-x-1/2 rounded-full bg-encre px-3 py-1.5 text-white md:top-[88px]"
        style={{
          opacity: hint ? 1 : 0,
          translate: hint ? '-50% 0' : '-50% -6px',
          transition: `opacity .3s, translate .45s ${EASE}`,
        }}
      >
        Menu
      </span>

      {/* Mobile et tablette : menu plein écran */}
      <div
        id="menu-mobile"
        data-lenis-prevent
        aria-hidden={!open}
        data-tone="dark"
        className="fixed inset-0 z-40 flex flex-col bg-encre px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-28 text-white lg:hidden"
        style={{
          clipPath: open ? 'circle(150% at 50% 44px)' : 'circle(0px at 50% 44px)',
          transition: `clip-path .8s ${EASE}`,
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <nav aria-label="Navigation mobile" className="[perspective:700px]">
          <ul className="flex flex-col">
            {LINKS.map((l, i) => (
              <li key={l.href} className="border-b border-trait">
                <a
                  href={l.href}
                  tabIndex={open ? 0 : -1}
                  aria-current={active === l.href ? 'page' : undefined}
                  className="flex items-baseline gap-4 py-3.5 text-[clamp(2rem,9vw,3rem)] font-extrabold tracking-[-0.045em]"
                  style={{
                    opacity: open ? 1 : 0,
                    transform: `rotateX(${open ? 0 : -92}deg)`,
                    transformOrigin: '50% 0',
                    transition: `opacity .45s, transform .7s ${EASE}`,
                    transitionDelay: open ? `${0.2 + i * 0.06}s` : '0s',
                    color: active === l.href ? 'white' : 'rgba(255,255,255,.55)',
                  }}
                >
                  <span className="w-7 text-xs font-medium tracking-normal text-doux">{num(i)}</span>
                  {l.label}
                  {active === l.href && <span aria-hidden="true" className="size-2.5 self-center rounded-full bg-bronze" />}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto transition-opacity duration-500" style={{ opacity: open ? 1 : 0, transitionDelay: open ? '.55s' : '0s' }}>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            tabIndex={open ? 0 : -1}
            className="flex items-center justify-center gap-2 rounded-full bg-white py-4 text-base font-medium text-encre"
          >
            <span className="size-2 rounded-full bg-[#3BD16F]" aria-hidden="true" />
            Écrire sur WhatsApp
          </a>
          <div className="mt-4 flex items-center justify-center gap-3 text-[13px] text-doux">
            <span>Abidjan · {time}</span>
            <ThemeToggle className="text-white" tabIndex={open ? 0 : -1} />
          </div>
        </div>
      </div>
    </>
  )
}
