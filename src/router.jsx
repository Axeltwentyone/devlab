import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react'

// Petit routeur maison : quelques pages, pas besoin d'une bibliothèque.
// Tous les liens internes du site (<a href="/projets">, <a href="#diagnostic">…) passent par lui :
// - un chemin interne change de page sans recharger ;
// - une ancre absente de la page en cours (#diagnostic depuis /studio) ramène à l'accueil, à cette section.
const RouterContext = createContext({ path: '/', navigate: () => {} })

const scrollToHash = (hash) => {
  const el = hash && document.getElementById(decodeURIComponent(hash.slice(1)))
  if (el) el.scrollIntoView({ behavior: 'instant' })
  return Boolean(el)
}

export function Router({ children }) {
  const [location, setLocation] = useState(() => ({ path: window.location.pathname, hash: window.location.hash }))

  const navigate = (to) => {
    const url = new URL(to, window.location.href)
    window.history.pushState({}, '', url.pathname + url.search + url.hash)
    setLocation({ path: url.pathname, hash: url.hash, key: Date.now() })
  }

  useEffect(() => {
    const onPop = () => setLocation({ path: window.location.pathname, hash: window.location.hash, key: Date.now() })
    window.addEventListener('popstate', onPop)

    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest('a[href]')
      if (!a || a.target || a.hasAttribute('download')) return
      const url = new URL(a.getAttribute('href'), window.location.href)
      if (url.origin !== window.location.origin || /^\/(admin|api)(\/|$)/.test(url.pathname)) return
      const samePage = url.pathname === window.location.pathname
      if (samePage && url.hash) {
        // Ancre sur la page : défilement normal. Ancre absente : retour à l'accueil.
        if (document.getElementById(decodeURIComponent(url.hash.slice(1)))) return
        if (url.pathname === '/') return
        e.preventDefault()
        navigate(`/${url.hash}`)
        return
      }
      e.preventDefault()
      if (!samePage || url.search !== window.location.search) navigate(url.pathname + url.search + url.hash)
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('popstate', onPop)
      document.removeEventListener('click', onClick)
    }
  }, [])

  // Nouvelle page : en haut, ou à la section demandée (une fois la page affichée)
  useLayoutEffect(() => {
    if (!location.key) return
    if (location.hash) {
      let tries = 0
      const tick = () => { if (!scrollToHash(location.hash) && tries++ < 20) requestAnimationFrame(tick) }
      tick()
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [location])

  return <RouterContext.Provider value={{ path: location.path, navigate }}>{children}</RouterContext.Provider>
}

export const useRouter = () => useContext(RouterContext)

// Titre de l'onglet propre à chaque page
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · theLab.` : 'theLab. — Studio web & mobile à Abidjan'
  }, [title])
}
