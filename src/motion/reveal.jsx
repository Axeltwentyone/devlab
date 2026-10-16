import { useEffect } from 'react'

// Une seule animation d'apparition pour tout le site : montée de 28 px, flou qui se dissipe, 0,8 s.
// - data-reveal : l'élément apparaît quand il entre à l'écran ;
// - data-reveal-stagger : ses enfants apparaissent l'un après l'autre (70 ms d'écart).
// Le CSS est dans index.css ; la classe `reveal-ready` est posée avant le premier affichage (main.jsx),
// pour que rien ne reste caché si le JavaScript ne tourne pas.
export function prepareReveal() {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.classList.add('reveal-ready')
}

// Un seul observateur pour toute la vie du site : il repère aussi les éléments des pages suivantes
export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.setAttribute('data-revealed', '')
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    )
    const scan = () => {
      document.querySelectorAll('[data-reveal]:not([data-reveal-seen]), [data-reveal-stagger]:not([data-reveal-seen])').forEach((el) => {
        el.setAttribute('data-reveal-seen', '')
        if (el.hasAttribute('data-reveal-stagger')) [...el.children].forEach((c, i) => c.style.setProperty('--i', i))
        io.observe(el)
      })
    }
    scan()
    // Le contenu peut changer après coup (contenu du back-office, filtres) : on surveille les ajouts
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
}

// Titre dont les mots montent l'un après l'autre
export function Words({ text, className = '' }) {
  const words = String(text).split(' ')
  return words.map((w, i) => (
    <span key={i} className={`inline-block ${className}`}>
      {w}
      {i < words.length - 1 ? ' ' : ''}
    </span>
  ))
}
