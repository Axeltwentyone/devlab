import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Mark } from './components/Logo.jsx'
import { scrollToEl, scrollToY } from './motion/scroll.js'
import { DEFAULT_META, allRoutes } from './content/seo.js'

// Petit routeur maison : quelques pages, pas besoin d'une bibliothèque.
// Tous les liens internes du site (<a href="/projets">, <a href="#diagnostic">…) passent par lui :
// - un chemin interne change de page sans recharger, derrière un rideau encre ;
// - une ancre de la page en cours défile en douceur ;
// - une ancre absente de la page en cours (#diagnostic depuis /studio) ramène à l'accueil, à cette section.
const RouterContext = createContext({ path: '/', navigate: () => {} })

const COVER_MS = 420 // le rideau monte
const REVEAL_MS = 650 // puis se retire vers le haut

const findHash = (hash) => hash && document.getElementById(decodeURIComponent(hash.slice(1)))
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Rideau de transition : monte depuis le bas, couvre la page avec le signe, puis s'en va par le haut
function Curtain({ phase }) {
  const y = phase === 'cover' ? '0%' : phase === 'reveal' ? '-100%' : '100%'
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-encre"
      style={{
        transform: `translateY(${y})`,
        transition: phase === 'cover'
          ? `transform ${COVER_MS}ms cubic-bezier(.7,0,.3,1)`
          : phase === 'reveal' ? `transform ${REVEAL_MS}ms cubic-bezier(.7,0,.2,1)` : 'none',
        visibility: phase ? 'visible' : 'hidden',
      }}
    >
      <span
        className="transition-[opacity,scale] duration-300"
        style={{ opacity: phase === 'cover' ? 1 : 0, scale: phase === 'cover' ? '1' : '0.8', transitionDelay: phase === 'cover' ? '150ms' : '0ms' }}
      >
        <Mark className="h-12 w-auto" ring="#F3F2EE" />
      </span>
    </div>
  )
}

export function Router({ children }) {
  const [location, setLocation] = useState(() => ({ path: window.location.pathname, hash: window.location.hash }))
  const [phase, setPhase] = useState(null)
  const timers = useRef([])

  const go = (url) => {
    window.history.pushState({}, '', url.pathname + url.search + url.hash)
    setLocation({ path: url.pathname, hash: url.hash, key: Date.now() })
  }

  const navigate = (to) => {
    const url = new URL(to, window.location.href)
    timers.current.forEach(clearTimeout)
    if (url.pathname === window.location.pathname || reducedMotion()) return go(url)
    setPhase('cover')
    timers.current = [
      setTimeout(() => {
        go(url)
        requestAnimationFrame(() => requestAnimationFrame(() => setPhase('reveal')))
      }, COVER_MS),
      setTimeout(() => setPhase(null), COVER_MS + REVEAL_MS + 80),
    ]
  }
  const navigateRef = useRef(navigate)
  navigateRef.current = navigate

  useEffect(() => {
    const onPop = () => setLocation({ path: window.location.pathname, hash: window.location.hash, key: Date.now() })
    window.addEventListener('popstate', onPop)

    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest('a[href]')
      if (!a || a.target || a.hasAttribute('download')) return
      const url = new URL(a.getAttribute('href'), window.location.href)
      if (url.origin !== window.location.origin || /^\/(admin|api)(\/|$)/.test(url.pathname)) return
      const samePage = url.pathname === window.location.pathname && url.search === window.location.search
      e.preventDefault()
      if (samePage && url.hash) {
        const el = findHash(url.hash)
        if (el) {
          window.history.pushState({}, '', url.hash)
          scrollToEl(el)
        } else if (url.pathname !== '/') {
          navigateRef.current(`/${url.hash}`)
        }
        return
      }
      if (samePage) scrollToY(0)
      else navigateRef.current(url.pathname + url.search + url.hash)
    }
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('popstate', onPop)
      document.removeEventListener('click', onClick)
      timers.current.forEach(clearTimeout)
    }
  }, [])

  // Nouvelle page : en haut, ou à la section demandée (une fois la page affichée)
  useLayoutEffect(() => {
    if (!location.key) return
    if (location.hash) {
      let tries = 0
      const tick = () => {
        const el = findHash(location.hash)
        if (el) scrollToEl(el, { instant: true })
        else if (tries++ < 20) requestAnimationFrame(tick)
      }
      tick()
    } else {
      scrollToY(0, { instant: true })
    }
  }, [location])

  return (
    <RouterContext.Provider value={{ path: location.path, navigate }}>
      {children}
      <Curtain phase={phase} />
    </RouterContext.Provider>
  )
}

export const useRouter = () => useContext(RouterContext)

// Titre de l'onglet et description propres à chaque page (les mêmes que dans les pages générées au build)
export function usePageTitle(title, description) {
  useEffect(() => {
    const path = window.location.pathname.replace(/\/+$/, '') || '/'
    const fromBuild = allRoutes()[path.toLowerCase()]
    document.title = title ? `${title} · theLab.` : DEFAULT_META.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description || fromBuild?.description || DEFAULT_META.description)
  }, [title, description])
}
