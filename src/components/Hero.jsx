import { Dot } from './Logo.jsx'
import { useEffect, useState } from 'react'
import { AVAILABILITY, HOURS, NOW, whatsappLink } from '../data/site.js'
import useAbidjanClock from '../hooks/useAbidjanClock.js'

const pad = (n) => String(n).padStart(2, '0')

// Bande « en direct » : ce qu'on fait maintenant, l'heure au studio, les places restantes.
function LiveStatus() {
  const { h, m, s, open } = useAbidjanClock()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (NOW.length < 2) return
    const id = setInterval(() => setI((x) => (x + 1) % NOW.length), 3800)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="mt-12 grid gap-6 border-t border-encre pt-5 sm:grid-cols-[minmax(0,1.6fr)_1fr_1fr] sm:gap-10 md:mt-24 md:max-w-5xl">
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-xs font-medium text-gris">
          <span aria-hidden="true" className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-bronze opacity-60" />
            <span className="relative size-2 rounded-full bg-bronze" />
          </span>
          En ce moment au studio
        </p>
        <p className="relative mt-1 h-[1.5em] overflow-hidden text-[15px]" aria-live="polite">
          {NOW.map((line, k) => (
            <span
              key={line}
              aria-hidden={k !== i}
              className="absolute inset-0 truncate transition-all duration-500 ease-[cubic-bezier(.2,.7,.2,1)]"
              style={{ opacity: k === i ? 1 : 0, transform: `translateY(${k === i ? 0 : k === (i + NOW.length - 1) % NOW.length ? -100 : 100}%)` }}
            >
              {line}
            </span>
          ))}
        </p>
      </div>

      <div>
        <p className="text-xs font-medium text-gris">Abidjan</p>
        <p className="mt-1 text-[15px] tabular-nums">
          {pad(h)}:{pad(m)}<span className="text-doux">:{pad(s)}</span>
          <span className="ml-2 text-gris">· {open ? 'Studio ouvert' : `Fermé, réouverture ${HOURS.open} h`}</span>
        </p>
      </div>

      <div>
        <p className="text-xs font-medium text-gris">Disponibilité</p>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-3 text-[15px]">
          {AVAILABILITY}
          <a href={whatsappLink('Bonjour DevLab ! J’aimerais réserver une place pour mon projet.')} target="_blank" rel="noreferrer" className="border-b border-encre text-sm font-medium transition-colors hover:border-bronze hover:text-bronze">
            Réserver ↗
          </a>
        </p>
      </div>
    </div>
  )
}

const LINES = ['On construit des', 'produits numériques', 'qui tiennent']

export default function Hero() {
  return (
    <section id="top" className="mx-auto max-w-[1440px] px-5 pb-16 pt-16 md:px-[72px] md:pb-28 md:pt-36">
      <h1 className="text-[clamp(2.9rem,9.3vw,8.5rem)] font-extrabold leading-[0.95] tracking-[-0.05em]">
        {LINES.map((line, i) => (
          <span key={line} className="block overflow-hidden pb-[0.06em]">
            <span className="hero-line block" style={{ animationDelay: `${120 + i * 110}ms` }}>
              {line}
              {i === LINES.length - 1 && <Dot className="bg-bronze" />}
            </span>
          </span>
        ))}
      </h1>

      <LiveStatus />

      <style>{`
        .hero-line { transform: translateY(105%); animation: hero-rise 900ms cubic-bezier(.2,.7,.1,1) forwards; }
        @keyframes hero-rise { to { transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) { .hero-line { transform: none; animation: none; } }
      `}</style>
    </section>
  )
}
